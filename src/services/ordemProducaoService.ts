import {LinhaProducao} from "../types/LinhaProducao";
import {
    getProductionLineQuery,
    getProductionOrderDetailQuery,
    getProductionOrderListQuery
} from "../dataBase/ordemProducaoRepository";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples";
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";

export async function buscarLinhasProducao(): Promise<LinhaProducao[]>  {
    return getProductionLineQuery();
}

export async function buscarOrdensProducao(): Promise<OrdemProducaoSimples[]>  {
    return getProductionOrderListQuery();
}

export async function buscarOrdemProducao(id: number): Promise<OrdemProducaoDetalhado | null>  {
    return getProductionOrderDetailQuery(id);
}
