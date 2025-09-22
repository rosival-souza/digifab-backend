import {ProducaoDiaLinha} from "../types/ProducaoDiaLinha";
import {
    getDailyMpConsumptionQuery,
    getDailyProductionByLineQuery,
    getLineUtilizationAverageQuery,
    getLineUtilizationSimpleAverageQuery,
    getMpConsumptionByTypeQuery,
    getOrdersCountQuery,
    getPlannedUnitsQuery,
    getRawMpMonsumedQuery,
    getServedProductLotsQuery,
    getTopProductsQuery,
    getMpSummaryQuery
} from "../dataBase/dashboardRepository";
import {TopProduto} from "../types/TopProduto";
import {ConsumoMpDia} from "../types/ConsumoMpDia";
import {ConsumoMpTipo} from "../types/ConsumoMpTipo";
import {PlanejadoVersusConsumido} from "../types/PlanejadoVersusConsumido";

export async function buscarOps(): Promise<number> {
    return await getOrdersCountQuery()
}

export async function buscarUnidadesPlanejadas(): Promise<number> {
    return await getPlannedUnitsQuery()
}

export async function buscarMateriaPrimaConsumida(): Promise<number> {
    return await getRawMpMonsumedQuery()
}

export async function buscarLotesProdutoAtendidos(): Promise<number> {
    return await getServedProductLotsQuery()
}

export async function buscarUtilizacaoMediaLinhas(): Promise<number> {
    return await getLineUtilizationAverageQuery()
}

export async function buscarUtilizacaoMediaSimplesLinhas(): Promise<number> {
    return await getLineUtilizationSimpleAverageQuery()
}

export async function buscarProducaoPorDiaPorLinha(): Promise<ProducaoDiaLinha[]> {
    return await getDailyProductionByLineQuery()
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

export async function buscarPlanejadoVersusConsumido(): Promise<PlanejadoVersusConsumido[]> {
    return await getMpSummaryQuery()
}
