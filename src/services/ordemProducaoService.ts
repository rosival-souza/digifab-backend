import {LinhaProducao} from "../types/LinhaProducao";
import {
    createConsumptionItemQuery,
    createProductionOrderQuery,
    getBalancesByRmLotByOpListQuery, getConsumptionItemListQuery, getConsumptionPointingDetailQuery,
    getProductionLineQuery,
    getProductionOrderDetailQuery,
    getProductionOrderListQuery,
    getProductLotQuery
} from "../dataBase/ordemProducaoRepository";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples";
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";
import {LoteProduto} from "../types/LoteProduto";
import {MateriaPrima} from "../types/MateriaPrima";
import {SaldoPorLoteMp} from "../types/SaldoPorLoteMp";
import {ConsumoDetalhe} from "../types/ConsumoDetalhe";
import {ConsumoItem} from "../types/ConsumoItem";

export async function buscarLinhasProducao(): Promise<LinhaProducao[]>  {
    return getProductionLineQuery();
}

export async function buscarLotesProduto(): Promise<LoteProduto[]>  {
    return getProductLotQuery();
}

export async function buscarOrdensProducao(): Promise<OrdemProducaoSimples[]>  {
    return getProductionOrderListQuery();
}

export async function buscarOrdemProducao(id: number): Promise<OrdemProducaoDetalhado | null>  {
    return getProductionOrderDetailQuery(id);
}

export async function criarOrdemProducao(codigo:string,
                                         idLoteProduto:string,
                                         idLinhaProducao:string,
                                         idResponsavel:string,
                                         quantidadeProduzir:string,
                                         dataHoraInicio:string): Promise<number>  {
    return createProductionOrderQuery(codigo,
        idLoteProduto,
        idLinhaProducao,
        idResponsavel,
        quantidadeProduzir,
        dataHoraInicio);
}

export async function buscarSaldoPorLoteMpPorOp(idOrdemProducao: number): Promise<SaldoPorLoteMp[]> {
    return getBalancesByRmLotByOpListQuery(idOrdemProducao);
}

export async function buscarDetalhesApontamentoDeConsumo(idOrdemProducao: number): Promise<ConsumoDetalhe | null> {
    return getConsumptionPointingDetailQuery(idOrdemProducao);
}

export async function buscarItensConsumidos(idOrdemProducao: number): Promise<ConsumoItem[]> {
    return getConsumptionItemListQuery(idOrdemProducao);
}

export async function criarItemConsumido(idOrdemProducao: number, idLoteMp: number, quantidade: number) {
    await createConsumptionItemQuery(idOrdemProducao, idLoteMp, quantidade);
}
