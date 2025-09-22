import { createConnectionWithRetry } from './mysqlClient';
import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {getDailyMpConsumption, getMpConsumptionByType} from "../controllers/dashboard.controller";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";

const dataFim = Date.now();
const dataInicio = new Date().setDate(dataFim.valueOf() - 15);

export async function getDailyProductionByLine(): Promise<ProducaoDiaLinha[]> {

    const connection = await createConnectionWithRetry();

    let producaoDiaLinhaList: ProducaoDiaLinha[] = new Array<ProducaoDiaLinha>();

    try {
        const [result] = await connection.execute(
            `
                 SELECT DIA
                       ,CODIGO_LINHA
                       ,NOME_LINHA
                       ,QTD_PLANEJADA
                   FROM VW_PRODUCAO_POR_DIA_LINHA
                  WHERE DIA BETWEEN ? AND ?
                  ORDER BY DIA
                          ,CODIGO_LINHA`, [obterDataInicial(), obterDataAtual()]);
        producaoDiaLinhaList = result as ProducaoDiaLinha[];

        console.log('ProducaoDiaLinhaList: ', producaoDiaLinhaList);

    } catch (error) {
        console.error('❌ Falha ao buscar Produção por Dia por Linha:', error);
    } finally {
        await connection.end();
    }

    return producaoDiaLinhaList;
}

export async function getTopProductsQuery(): Promise<TopProduto[]> {

    const connection = await createConnectionWithRetry();

    let topProdutoList: TopProduto[] = new Array<TopProduto>();

    try {
        const [result] = await connection.execute(
            `
                SELECT B.CODIGO_PRODUTO
                      ,B.NOME_PRODUTO
                      ,SUM(B.QUANTIDADE_PRODUZIR) AS TOTAL_PLANEJADO
                  FROM VW_OP_BASICA B
                 WHERE B.DIA BETWEEN ? AND ?
                 GROUP BY B.CODIGO_PRODUTO
                         ,B.NOME_PRODUTO
                 ORDER BY TOTAL_PLANEJADO DESC
                 LIMIT 5`, [obterDataInicial(), obterDataAtual()]);
        topProdutoList = result as TopProduto[];

        console.log('topProdutoList: ', topProdutoList);

    } catch (error) {
        console.error('❌ Falha ao buscar os Top Produtos:', error);
    } finally {
        await connection.end();
    }

    return topProdutoList;
}

export async function getDailyMpConsumptionQuery(): Promise<ConsumoMpDia[]> {

    const connection = await createConnectionWithRetry();

    let consumoMpDiaList: ConsumoMpDia[] = new Array<ConsumoMpDia>();

    try {
        const [result] = await connection.execute(
            `
                SELECT DIA
                      ,CODIGO_MP
                      ,NOME_MP
                      ,CONSUMO_KG
                  FROM VW_CONSUMO_MP_POR_DIA
                 WHERE DIA BETWEEN ? AND ?
                 ORDER BY DIA
                         ,CODIGO_MP`, [obterDataInicial(), obterDataAtual()]);
        consumoMpDiaList = result as ConsumoMpDia[];

        console.log('consumoMpDiaList: ', consumoMpDiaList);

    } catch (error) {
        console.error('❌ Falha ao buscar o Consumo MP por dia:', error);
    } finally {
        await connection.end();
    }

    return consumoMpDiaList;
}

export async function getMpConsumptionByTypeQuery(): Promise<ConsumoMpTipo[]> {

    const connection = await createConnectionWithRetry();

    let consumoMpTipoList: ConsumoMpTipo[] = new Array<ConsumoMpTipo>();

    try {
        const [result] = await connection.execute(
            `
                SELECT MP.CODIGO_MP
                      ,MP.NOME_MP
                      ,ROUND(SUM(CMD.CONSUMO_KG),3) AS CONSUMO_KG
                  FROM VW_CONSUMO_MP_POR_DIA CMD
                         JOIN (SELECT DISTINCT CODIGO_MP
                                              ,NOME_MP FROM VW_CONSUMO_MP) MP
                           ON MP.CODIGO_MP = CMD.CODIGO_MP
                 WHERE CMD.DIA BETWEEN ? AND ?
                 GROUP BY MP.CODIGO_MP
                         ,MP.NOME_MP
                 ORDER BY CONSUMO_KG DESC`, [obterDataInicial(), obterDataAtual()]);
        consumoMpTipoList = result as ConsumoMpDia[];

        console.log('consumoMpTipoList: ', consumoMpTipoList);

    } catch (error) {
        console.error('❌ Falha ao buscar o Consumo MP por dia:', error);
    } finally {
        await connection.end();
    }

    return consumoMpTipoList;
}

function obterDataInicial() {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function obterDataAtual() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
