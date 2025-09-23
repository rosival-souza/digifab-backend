import {Usuario} from "./Usuario";

export interface LinhaProducao {
    idLinhaProducao: number;
    codigoLinhaProducao: string;
    nomeLinhaProducao: string;
    capacidadeHora: number;
    descricao: string;
    status: string;
    responsavel: Usuario;
}