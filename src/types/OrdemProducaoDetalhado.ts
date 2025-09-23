import {LinhaProducao} from "./LinhaProducao";
import {LoteProduto} from "./LoteProduto";
import {Usuario} from "./Usuario";

export interface OrdemProducaoDetalhado {
    idOrdemProducao: number,
    codigoOrdemProducao: string,
    loteProduto: LoteProduto,
    linhaProducao: LinhaProducao,
    quantidadeProducao: number,
    dataHoraInicio: Date,
    usuario: Usuario
}