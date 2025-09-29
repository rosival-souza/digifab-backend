import {Rastreabilidade} from "../types/Rastreabilidade";
import {getTrackabilityQuery} from "../dataBase/rastreabilidadeRepository";

export async function buscarRastreabilidade(codigoLoteProduto: string): Promise<Rastreabilidade[]>  {
    return getTrackabilityQuery(codigoLoteProduto);
}