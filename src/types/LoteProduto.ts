import {Produto} from "./Produto";

export interface LoteProduto {
    idLoteProduto: number,
    codigoLoteProduto: string,
    codigoFabrica: string,
    dataProducao: Date,
    produto: Produto,
}