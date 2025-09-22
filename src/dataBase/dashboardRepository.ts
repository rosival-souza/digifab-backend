import { createConnectionWithRetry } from './mysqlClient';
import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";

export async function getOrdersCount(): Promise<number> {
    const connection = await createConnectionWithRetry();

    let orders: number = 0;

    try {
        const [result] = await connection.execute(
            `
                SELECT COUNT(*) AS QTD_OPS
                  FROM ORDEM_PRODUCAO
                 WHERE DT_HORA_INICIO >= ?
                   AND DT_HORA_INICIO <  DATE_ADD(?, INTERVAL 1 DAY)`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        orders = result[0].QTD_OPS as number;

        console.log('orders: ', orders);

    } catch (error) {
        console.error('❌ Falha ao buscar a quantidade de OP\'s:', error);
    } finally {
        await connection.end();
    }

    return orders;
}

export async function getPlannedUnits(): Promise<number> {
    const connection = await createConnectionWithRetry();

    let plannedUnits: number = 0;

    try {
        const [result] = await connection.execute(
            `
                SELECT COALESCE(SUM(QUANTIDADE_PRODUZIR),0) AS UNIDADES_PLANEJADAS
                  FROM ORDEM_PRODUCAO
                 WHERE DT_HORA_INICIO >= ?
                   AND DT_HORA_INICIO <  DATE_ADD(?, INTERVAL 1 DAY)`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        plannedUnits = result[0].UNIDADES_PLANEJADAS as number;

        console.log('plannedUnits: ', plannedUnits);

    } catch (error) {
        console.error('❌ Falha ao buscar as unidades planejadas no período:', error);
    } finally {
        await connection.end();
    }

    return plannedUnits;
}

export async function getRawMpMonsumed(): Promise<number> {
    const connection = await createConnectionWithRetry();

    let rawMpConsumed: number = 0;

    try {
        const [result] = await connection.execute(
            `
                SELECT ROUND(COALESCE(SUM(CONSUMO_KG),0),3) AS MP_CONSUMIDA_KG
                  FROM VW_CONSUMO_MP_POR_DIA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        rawMpConsumed = result[0].MP_CONSUMIDA_KG as number;

        console.log('rawMpConsumed: ', rawMpConsumed);

    } catch (error) {
        console.error('❌ Falha ao buscar as quantidade de matéria-prima consumida (kg) no período:', error);
    } finally {
        await connection.end();
    }

    return rawMpConsumed;
}

export async function getServedProductLots(): Promise<number> {
    const connection = await createConnectionWithRetry();

    let servedProductLots: number = 0;

    try {
        const [result] = await connection.execute(
            `
                SELECT COUNT(DISTINCT ID_LOTE_PRODUTO) AS LOTES_PRODUTO_ATENDIDOS
                  FROM VW_OP_BASICA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        servedProductLots = result[0].LOTES_PRODUTO_ATENDIDOS as number;

        console.log('servedProductLots: ', servedProductLots);

    } catch (error) {
        console.error('❌ Falha ao buscar a quantidade de lotes de produto atendidos:', error);
    } finally {
        await connection.end();
    }

    return servedProductLots;
}

export async function getLineUtilizationAverage(): Promise<number> {
    const connection = await createConnectionWithRetry();

    let lineUtilizationAverage: number = 0;

    try {
        const [result] = await connection.execute(
            `
                SELECT ROUND(COALESCE(SUM(PROGRAMADO_DIA),0) / NULLIF(COALESCE(SUM(CAPACIDADE_ESTIMADA),0),0), 2) AS UTILIZACAO_MEDIA_PONDERADA
                  FROM VW_UTILIZACAO_LINHA_DIA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        lineUtilizationAverage = result[0].UTILIZACAO_MEDIA_PONDERADA as number;

        console.log('lineUtilizationAverage: ', lineUtilizationAverage);

    } catch (error) {
        console.error('❌ Falha ao buscar as utilização média (ponderada) das linhas no período:', error);
    } finally {
        await connection.end();
    }

    return lineUtilizationAverage;
}

export async function getLineUtilizationSimpleAverage(): Promise<number> {
    const connection = await createConnectionWithRetry();

    let lineUtilizationSimpleAverage: number = 0;

    try {
        const [result] = await connection.execute(
            `
                SELECT ROUND(AVG(UTILIZACAO_REL), 2) AS UTILIZACAO_MEDIA_SIMPLES
                  FROM VW_UTILIZACAO_LINHA_DIA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        lineUtilizationSimpleAverage = result[0].UTILIZACAO_MEDIA_SIMPLES as number;

        console.log('lineUtilizationSimpleAverage: ', lineUtilizationSimpleAverage);

    } catch (error) {
        console.error('❌ Falha ao buscar as utilização média simples das linhas no período:', error);
    } finally {
        await connection.end();
    }

    return lineUtilizationSimpleAverage;
}

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
