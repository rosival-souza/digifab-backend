import { createConnectionWithRetry } from './mysqlClient';
import { LinhaProducao } from "../types/LinhaProducao";
import { OrdemProducaoSimples } from "../types/OrdemProducaoSimples"
import { OrdemProducaoDetalhado } from "../types/OrdemProducaoDetalhado";

export async function getProductionLineQuery(): Promise<LinhaProducao[]> {
    const connection = await createConnectionWithRetry();

    let linhaProducaoList: LinhaProducao[] = [];

    try {
        const [result] = await connection.query(`
        SELECT LP.ID_LINHA_PRODUCAO AS idLinhaProducao
              ,LP.CODIGO            AS codigo
              ,LP.NOME              AS nome
              ,LP.CAPACIDADE_HORA   AS capacidadeHora
              ,LP.DESCRICAO         AS descricao
              ,LP.STATUS            AS status
              ,U.ID_USUARIO         AS idUsuario
              ,U.NOME               AS nomeUsuario
              ,U.EMAIL              AS email
          FROM LINHA_PRODUCAO LP
          JOIN USUARIO U ON LP.ID_RESPONSAVEL = U.ID_USUARIO`)
        // @ts-ignore
        linhaProducaoList = result.map((row: any) => ({
            idOrdemProducao: row.idOrdemProducao,
            codigo: row.codigo,
            nome: row.nome,
            capacidadeHora: row.capacidadeHora,
            descricao: row.descricao,
            status: row.status,
            reponsavel: {
                idUsuario: row.idUsuario,
                nomeUsuario: row.nomeUsuario,
                email: row.email
            }
        })) satisfies LinhaProducao[]

    } catch (exception) {
        console.error('❌ Falha ao buscar as linhas de produção:', exception);
    } finally {
        await connection.end();
    }

    return linhaProducaoList;
}

export async function getProductionOrderListQuery(): Promise<OrdemProducaoSimples[]> {
    const connection = await createConnectionWithRetry();

    let ordemProducaoList: OrdemProducaoSimples[] = [];

    try {
        const [result] = await connection.query(`
            SELECT OP.ID_ORDEM_PRODUCAO     AS idOrdemProducao
                  ,OP.CODIGO                AS codigoOrdemProducao
                  ,LP.CODIGO                AS codigoLoteProduto
                  ,LINPROD.CODIGO           AS codigoLinhaProducao
                  ,P.CODIGO                 AS codigoProduto
                  ,OP.QUANTIDADE_PRODUZIR   AS quantidadeProduzir
                  ,OP.DT_HORA_INICIO        AS dataHoraInicio
              FROM ORDEM_PRODUCAO OP
              JOIN LOTE_PRODUTO LP
                ON LP.ID_LOTE_PRODUTO = OP.ID_LOTE_PRODUTO
              JOIN PRODUTO P
               ON P.ID_PRODUTO = LP.ID_PRODUTO
              JOIN LINHA_PRODUCAO LINPROD
                   ON LINPROD.ID_LINHA_PRODUCAO = OP.ID_LINHA_PRODUCAO`)
        ordemProducaoList = result as OrdemProducaoSimples[];

    } catch (exception) {
        console.error('❌ Falha ao buscar a listagem de ordens de produção:', exception);
    } finally {
        await connection.end();
    }

    return ordemProducaoList;
}

export async function getProductionOrderDetailQuery(id: number): Promise<OrdemProducaoDetalhado | null> {
    const connection = await createConnectionWithRetry();

    let ordemProducao: OrdemProducaoDetalhado;

    try {
        const [result] = await connection.query(`
            SELECT OP.ID_ORDEM_PRODUCAO         AS idOrdemProducao
                  ,OP.CODIGO                    AS codigoOrdemProducao
                  ,LP.ID_LOTE_PRODUTO           AS idLoteProduto
                  ,LP.CODIGO                    AS codigoLoteProduto
                  ,LP.CODIGO_FABRICA            AS codigoFabrica
                  ,LP.DATA_PRODUCAO             AS dataProducao
                  ,P.ID_PRODUTO                 AS idProduto
                  ,P.CODIGO                     AS codigoProduto
                  ,P.NOME                       AS nomeProduto
                  ,P.PESO_BRUTO                 AS pesoBruto
                  ,P.UNIDADE_MEDIDA             AS unidadeMedida
                  ,P.CODIGO_BARRAS              AS codigoBarras
                  ,LINPROD.ID_LINHA_PRODUCAO    AS idLinhaProducao
                  ,LINPROD.CODIGO               AS codigoLinhaProducao
                  ,LINPROD.CAPACIDADE_HORA      AS capacidadeHora
                  ,LINPROD.DESCRICAO            AS descricao
                  ,LINPROD.STATUS               AS status
                  ,OP.QUANTIDADE_PRODUZIR       AS quantidadeProduzir
                  ,OP.DT_HORA_INICIO            AS dataHoraInicio
                  ,U.ID_USUARIO                 AS idUsuario
                  ,U.NOME                       AS nomeUsuario
                  ,U.EMAIL                      AS email
              FROM ORDEM_PRODUCAO OP
              JOIN LOTE_PRODUTO LP
                ON LP.ID_LOTE_PRODUTO = OP.ID_LOTE_PRODUTO
              JOIN PRODUTO P
                ON P.ID_PRODUTO = LP.ID_PRODUTO
              JOIN LINHA_PRODUCAO LINPROD
                ON LINPROD.ID_LINHA_PRODUCAO = OP.ID_LINHA_PRODUCAO
              JOIN USUARIO U
                ON U.ID_USUARIO = OP.ID_RESPONSAVEL
             WHERE OP.ID_ORDEM_PRODUCAO = ?`, [id]);

        if (!Array.isArray(result) || !result.length) {
            return null;
        }

        const row: any = result[0];

        ordemProducao = {
            idOrdemProducao: row.idOrdemProducao,
            codigoOrdemProducao: row.codigoOrdemProducao,
            quantidadeProducao: row.quantidadeProducao,
            dataHoraInicio: new Date(row.dataHoraInicio),
            loteProduto: {
                idLoteProduto: row.idLoteProduto,
                codigoLoteProduto: row.codigoLoteProduto,
                codigoFabrica: row.codigoFabrica,
                dataProducao: new Date(row.dataProducao),
                produto: {
                    idProduto: row.idProduto,
                    codigoProduto: row.codigoProduto,
                    nomeProduto: row.nomeProduto,
                    pesoBruto: Number(row.pesoBruto),
                    unidadeMedida: row.unidadeMedida,
                    codigoBarras: row.codigoBarras,
                },
            },
            linhaProducao: {
                idLinhaProducao: row.idLinhaProducao,
                codigoLinhaProducao: row.codigoLinhaProducao,
                nomeLinhaProducao: row.nomeLinhaProducao,
                capacidadeHora: row.capacidadeHora,
                descricao: row.descricao,
                status: row.status,
                responsavel: {
                    id: String(row.idUsuario),
                    nomeUsuario: row.nomeUsuario,
                    email: row.email,
                },
            },
            usuario: {
                id: String(row.idUsuario),
                nomeUsuario: row.nomeUsuario,
                email: row.email,
            },
        } satisfies OrdemProducaoDetalhado;

    } catch (exception) {
        console.error('❌ Falha ao buscar os detalhes da ordem de produção:', exception);
    } finally {
        await connection.end();
    }

    // @ts-ignore
    return ordemProducao;
}

