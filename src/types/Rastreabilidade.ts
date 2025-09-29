export interface Rastreabilidade {
    codigoProduto: string;
    nomeProduto: string;
    loteProduto: string;
    codigoOp: string;
    inicioOp: Date;
    quantidadePlanejadaOp: number;
    responsavelOp: string;
    codigoMp: string;
    nomeMp: string;
    loteMp: string;
    codigoFornecedor: string;
    nomeFornecedor: string;
    notaFiscal: string;
    dataRecebimento: Date;
    dataValidade: Date;
    responsavelLoteMp: string;
    consumoKg: number;
    dataConsumo: Date;
}