import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {
    getDailyMpConsumptionQuery,
    getDailyProductionByLine, getMpConsumptionByTypeQuery,
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