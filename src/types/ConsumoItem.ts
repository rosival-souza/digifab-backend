export interface ConsumoItem {
    idOrdemProducao: number;
    idConsumoLoteMp: number;
    codigoMateriaPrima: string;
    codigoLoteMp: string;
    quantidade: number;
    dataConsumo: Date;
}