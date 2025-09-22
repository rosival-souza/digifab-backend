import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {
    getDailyMpConsumptionQuery,
    getDailyProductionByLine,
    getLineUtilizationAverage,
    getLineUtilizationSimpleAverage,
    getMpConsumptionByTypeQuery,
    getOrdersCount,
    getPlannedUnits,
    getRawMpMonsumed, getServedProductLots,
    getTopProductsQuery
} from "../dataBase/dashboardRepository";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";


export async function buscarProducaoPorDiaPorLinha(): Promise<ProducaoDiaLinha[]> {
    return await getDailyProductionByLine()
}

export async function buscarTopProdutos(): Promise<TopProduto[]> {
    return await getTopProductsQuery()
}

export async function buscarConsumoMpPorDia(): Promise<ConsumoMpDia[]> {
    return await getDailyMpConsumptionQuery()
}

export async function buscarConsumoMpPorTipo(): Promise<ConsumoMpTipo[]> {
    return await getMpConsumptionByTypeQuery()
}

export async function buscarOps(): Promise<number> {
    return await getOrdersCount()
}

export async function buscarUnidadesPlanejadas(): Promise<number> {
    return await getPlannedUnits()
}

export async function buscarMateriaPrimaConsumida(): Promise<number> {
    return await getRawMpMonsumed()
}

export async function buscarLotesProdutoAtendidos(): Promise<number> {
    return await getServedProductLots()
}

export async function buscarUtilizacaoMediaLinhas(): Promise<number> {
    return await getLineUtilizationAverage()
}

export async function buscarUtilizacaoMediaSimplesLinhas(): Promise<number> {
    return await getLineUtilizationSimpleAverage()
}
