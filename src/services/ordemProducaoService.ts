import {LinhaProducao} from "../types/LinhaProducao";
import {
    createProductionOrderQuery,
    getProductionLineQuery,
    getProductionOrderDetailQuery,
    getProductionOrderListQuery,
    getProductLotQuery
} from "../dataBase/ordemProducaoRepository";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples";
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";
import {LoteProduto} from "../types/LoteProduto";

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
