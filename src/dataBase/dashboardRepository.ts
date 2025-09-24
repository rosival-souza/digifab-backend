import { pool } from './mysqlClient';
import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";
import {PlanejadoVersusConsumido} from "../types/PlanejadoVersusConsumido";




export async function getOrdersCountQuery(): Promise<number> {
    let orders: number = 0;

    try {
        const [result] = await pool.execute(
            `
                SELECT COUNT(*) AS QTD_OPS
                  FROM ORDEM_PRODUCAO
                 WHERE DT_HORA_INICIO >= ?
                   AND DT_HORA_INICIO <  DATE_ADD(?, INTERVAL 1 DAY)`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        orders = result[0].QTD_OPS as number;

        console.log('orders: ', orders);
        return orders

    } catch (error) {
        console.error('❌ Falha ao buscar a quantidade de OP\'s:', error);
    }

    return orders;
}

export async function getPlannedUnitsQuery(): Promise<number> {
    let plannedUnits: number = 0;

    try {
        const [result] = await pool.execute(
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
    }

    return plannedUnits;
}

export async function getRawMpMonsumedQuery(): Promise<number> {

    let rawMpConsumed: number = 0;

    try {
        const [result] = await pool.execute(
            `
                SELECT ROUND(COALESCE(SUM(CONSUMO_KG),0),3) AS MP_CONSUMIDA_KG
                  FROM VW_CONSUMO_MP_POR_DIA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        rawMpConsumed = result[0].MP_CONSUMIDA_KG as number;

        console.log('rawMpConsumed: ', rawMpConsumed);

    } catch (error) {
        console.error('❌ Falha ao buscar as quantidade de matéria-prima consumida (kg) no período:', error);
    }

    return rawMpConsumed;
}

export async function getServedProductLotsQuery(): Promise<number> {
    let servedProductLots: number = 0;

    try {
        const [result] = await pool.execute(
            `
                SELECT COUNT(DISTINCT ID_LOTE_PRODUTO) AS LOTES_PRODUTO_ATENDIDOS
                  FROM VW_OP_BASICA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        servedProductLots = result[0].LOTES_PRODUTO_ATENDIDOS as number;

        console.log('servedProductLots: ', servedProductLots);

    } catch (error) {
        console.error('❌ Falha ao buscar a quantidade de lotes de produto atendidos:', error);
    }

    return servedProductLots;
}

export async function getLineUtilizationAverageQuery(): Promise<number> {
    let lineUtilizationAverage: number = 0;

    try {
        const [result] = await pool.execute(
            `
                SELECT ROUND(COALESCE(SUM(PROGRAMADO_DIA),0) / NULLIF(COALESCE(SUM(CAPACIDADE_ESTIMADA),0),0), 2) AS UTILIZACAO_MEDIA_PONDERADA
                  FROM VW_UTILIZACAO_LINHA_DIA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        lineUtilizationAverage = result[0].UTILIZACAO_MEDIA_PONDERADA as number;

        console.log('lineUtilizationAverage: ', lineUtilizationAverage);

    } catch (error) {
        console.error('❌ Falha ao buscar as utilização média (ponderada) das linhas no período:', error);
    }

    return lineUtilizationAverage;
}

export async function getLineUtilizationSimpleAverageQuery(): Promise<number> {
    let lineUtilizationSimpleAverage: number = 0;

    try {
        const [result] = await pool.execute(
            `
                SELECT ROUND(AVG(UTILIZACAO_REL), 2) AS UTILIZACAO_MEDIA_SIMPLES
                  FROM VW_UTILIZACAO_LINHA_DIA
                 WHERE DIA BETWEEN ? AND ?`, [obterDataInicial(), obterDataAtual()]);
        // @ts-ignore
        lineUtilizationSimpleAverage = result[0].UTILIZACAO_MEDIA_SIMPLES as number;

        console.log('lineUtilizationSimpleAverage: ', lineUtilizationSimpleAverage);

    } catch (error) {
        console.error('❌ Falha ao buscar as utilização média simples das linhas no período:', error);
    }

    return lineUtilizationSimpleAverage;
}

export async function getDailyProductionByLineQuery(): Promise<ProducaoDiaLinha[]> {
    let producaoDiaLinhaList: ProducaoDiaLinha[] = new Array<ProducaoDiaLinha>();

    try {
        const [result] = await pool.execute(
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
    }

    return producaoDiaLinhaList;
}

export async function getTopProductsQuery(): Promise<TopProduto[]> {
    let topProdutoList: TopProduto[] = new Array<TopProduto>();

    try {
        const [result] = await pool.execute(
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
    }

    return topProdutoList;
}

export async function getUsers() {
    let result: any
    try {

         [result] = await pool.execute('SELECT * FROM digifab.usuario')

        console.log('Users: ', result);

    } catch (error) {
        console.error('❌ Falha ao buscar os Top Produtos:', error);
    }

    return result;
}

export async function getDailyMpConsumptionQuery(): Promise<ConsumoMpDia[]> {
    let consumoMpDiaList: ConsumoMpDia[] = new Array<ConsumoMpDia>();

    try {
        const [result] = await pool.execute(
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
    }

    return consumoMpDiaList;
}

export async function getMpConsumptionByTypeQuery(): Promise<ConsumoMpTipo[]> {
    let consumoMpTipoList: ConsumoMpTipo[] = new Array<ConsumoMpTipo>();

    try {
        const [result] = await pool.execute(
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
    }

    return consumoMpTipoList;
}

export async function getMpSummaryQuery(): Promise<PlanejadoVersusConsumido[]> {
    let planejadoVersusConsumidoList: PlanejadoVersusConsumido[] = new Array<PlanejadoVersusConsumido>();

    try {
        const [result] = await pool.execute(
            `
                SELECT MP.CODIGO_MP
                      ,MP.NOME_MP
                      ,ROUND(SUM(V.PLANEJADO_KG),3) AS PLANEJADO_KG
                      ,ROUND(SUM(V.CONSUMIDO_KG),3) AS CONSUMIDO_KG
                      ,ROUND(SUM(V.DESVIO_KG),3)    AS DESVIO_KG
                  FROM (SELECT MP.ID_MATERIA_PRIMA
                              ,MP.CODIGO AS CODIGO_MP
                              ,MP.NOME   AS NOME_MP
                              ,SUM(MPO.QUANTIDADE_PREVISTA)                    AS PLANEJADO_KG
                              ,COALESCE(SUM(CONS.CONSUMO_TOTAL),0)             AS CONSUMIDO_KG
                              ,COALESCE(SUM(CONS.CONSUMO_TOTAL),0) - SUM(MPO.QUANTIDADE_PREVISTA) AS DESVIO_KG
                          FROM MATERIA_PRIMA_ORDEM_PRODUCAO MPO
                          JOIN ORDEM_PRODUCAO OP ON OP.ID_ORDEM_PRODUCAO = MPO.ID_ORDEM_PRODUCAO
                          JOIN MATERIA_PRIMA MP  ON MP.ID_MATERIA_PRIMA  = MPO.ID_MATERIA_PRIMA
                          LEFT JOIN (SELECT CLM.ID_ORDEM_PRODUCAO
                                           ,LM.ID_MATERIA_PRIMA
                                           ,SUM(CLM.QUANTIDADE_CONSUMIDA) AS CONSUMO_TOTAL
                                       FROM CONSUMO_LOTE_MP CLM
                                       JOIN LOTE_MP LM ON LM.ID_LOTE_MP = CLM.ID_LOTE_MP
                                      GROUP BY CLM.ID_ORDEM_PRODUCAO, LM.ID_MATERIA_PRIMA) CONS 
                                 ON CONS.ID_ORDEM_PRODUCAO = MPO.ID_ORDEM_PRODUCAO
                                AND CONS.ID_MATERIA_PRIMA  = MPO.ID_MATERIA_PRIMA
                              WHERE OP.DT_HORA_INICIO >= ?
                                AND OP.DT_HORA_INICIO <  DATE_ADD(?, INTERVAL 1 DAY)
                              GROUP BY MP.ID_MATERIA_PRIMA, MP.CODIGO, MP.NOME) V
                          JOIN (SELECT DISTINCT CODIGO_MP, NOME_MP 
                                  FROM VW_CONSUMO_MP) MP
                            ON MP.CODIGO_MP = V.CODIGO_MP
                 GROUP BY MP.CODIGO_MP
                         ,MP.NOME_MP
                 ORDER BY DESVIO_KG DESC`, [obterDataInicial(), obterDataAtual()]);
        planejadoVersusConsumidoList = result as PlanejadoVersusConsumido[];

        console.log('planejadoVersusConsumidoList: ', planejadoVersusConsumidoList);

    } catch (error) {
        console.error('❌ Falha ao buscar o desvio de planejado X consumido:', error);
    }

    return planejadoVersusConsumidoList;
}

function obterDataInicial() {
    const d = new Date();
    d.setDate(d.getDate() - 30);
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
