import {pool} from './mysqlClient';
import {Rastreabilidade} from "../types/Rastreabilidade";

export async function getTrackabilityQuery(codigoLoteProduto: string): Promise<Rastreabilidade[]> {
    let rastreabilidadeList: Rastreabilidade[] = [];

    try {
        const [result] = await pool.query(`
            SELECT CODIGO_PRODUTO      AS codigoProduto
                 , NOME_PRODUTO        AS nomeProduto
                 , LOTE_PRODUTO        AS loteProduto
                 , CODIGO_OP           AS codigoOp
                 , OP_INICIO           AS inicioOp
                 , OP_QTD_PLANEJADA    AS quantidadePlanejadaOp
                 , RESPONSAVEL_OP      AS responsavelOp
                 , CODIGO_MP           AS codigoMp
                 , NOME_MP             AS nomeMp
                 , LOTE_MP             AS loteMp
                 , CODIGO_FORNECEDOR   AS codigoFornecedor
                 , NOME_FORNECEDOR     AS nomeFornecedor
                 , NOTA_FISCAL         AS notaFiscal
                 , DATA_RECEBIMENTO    AS dataRecebimento
                 , DATA_VALIDADE       AS dataValidade
                 , RESPONSAVEL_LOTE_MP AS responsavelLoteMp
                 , CONSUMO_KG          AS consumoKg
                 , DATA_CONSUMO        AS dataConsumo
            FROM VW_RASTREABILIDADE_E2E
            WHERE LOTE_PRODUTO = ?
            ORDER BY CODIGO_MP, LOTE_MP, DATA_CONSUMO`, [codigoLoteProduto])

        // @ts-ignore
        rastreabilidadeList = result.map((row: any) => ({
            codigoProduto: row.codigoProduto,
            nomeProduto: row.nomeProduto,
            loteProduto: row.loteProduto,
            codigoOp: row.codigoOp,
            inicioOp: row.inicioOp,
            quantidadePlanejadaOp: row.quantidadePlanejadaOp,
            responsavelOp: row.responsavelOp,
            codigoMp: row.codigoMp,
            nomeMp: row.nomeMp,
            loteMp: row.loteMp,
            codigoFornecedor: row.codigoFornecedor,
            nomeFornecedor: row.nomeFornecedor,
            notaFiscal: row.notaFiscal,
            dataRecebimento: row.dataRecebimento,
            dataValidade: row.dataValidade,
            responsavelLoteMp: row.responsavelLoteMp,
            consumoKg: row.consumoKg,
            dataConsumo: row.dataConsumo
        })) satisfies Rastreabilidade[]
    } catch (exception) {
        console.error('❌ Falha ao buscar as rastreabilidades:', exception);
        throw exception;
    }

    return rastreabilidadeList;
}