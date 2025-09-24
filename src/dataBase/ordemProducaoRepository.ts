import {pool} from './mysqlClient';
import {LinhaProducao} from "../types/LinhaProducao";
import {OrdemProducaoSimples} from "../types/OrdemProducaoSimples"
import {OrdemProducaoDetalhado} from "../types/OrdemProducaoDetalhado";
import {LoteProduto} from "../types/LoteProduto";

export async function getProductionLineQuery(): Promise<LinhaProducao[]> {

    let linhaProducaoList: LinhaProducao[] = [];

    try {
        const [result] = await pool.query(`
            SELECT LP.ID_LINHA_PRODUCAO AS idLinhaProducao
                 , LP.CODIGO            AS codigo
                 , LP.NOME              AS nome
                 , LP.CAPACIDADE_HORA   AS capacidadeHora
                 , LP.DESCRICAO         AS descricao
                 , LP.STATUS            AS status
                 , U.ID_USUARIO         AS idUsuario
                 , U.NOME               AS nomeUsuario
                 , U.EMAIL              AS email
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
        throw exception;
    }

    return linhaProducaoList;
}

export async function getProductLotQuery(): Promise<LoteProduto[]> {
    let loteProdutoList: LoteProduto[] = [];

    try {
        const [result] = await pool.query(`
            SELECT LP.ID_LOTE_PRODUTO AS idLoteProduto
                 , LP.CODIGO          AS codigoLoteProduto
                 , LP.CODIGO_FABRICA  AS codigoFabrica
                 , LP.DATA_PRODUCAO   AS dataProducao
                 , P.ID_PRODUTO       AS idProduto
                 , P.CODIGO           AS codigoProduto
                 , P.NOME             AS nomeProduto
                 , P.PESO_BRUTO       AS pesoBruto
                 , P.UNIDADE_MEDIDA   AS unidadeMedida
                 , P.CODIGO_BARRAS    AS codigoBarras
            FROM LOTE_PRODUTO LP
                     JOIN PRODUTO P
                          ON P.ID_PRODUTO = LP.ID_PRODUTO`)

        // @ts-ignore
        loteProdutoList = result.map((row: any) => ({
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
            }
        })) satisfies LoteProduto[]

    } catch (exception) {
        console.error('❌ Falha ao buscar a listagem de lotes de produto:', exception);
        throw exception;
    }

    return loteProdutoList;
}

export async function getProductionOrderListQuery(): Promise<OrdemProducaoSimples[]> {

    let ordemProducaoList: OrdemProducaoSimples[] = [];

    try {
        const [result] = await pool.query(`
            SELECT OP.ID_ORDEM_PRODUCAO   AS idOrdemProducao
                 , OP.CODIGO              AS codigoOrdemProducao
                 , LP.CODIGO              AS codigoLoteProduto
                 , LINPROD.CODIGO         AS codigoLinhaProducao
                 , P.CODIGO               AS codigoProduto
                 , OP.QUANTIDADE_PRODUZIR AS quantidadeProduzir
                 , OP.DT_HORA_INICIO      AS dataHoraInicio
            FROM ORDEM_PRODUCAO OP
                     JOIN LOTE_PRODUTO LP
                          ON LP.ID_LOTE_PRODUTO = OP.ID_LOTE_PRODUTO
                     JOIN PRODUTO P
                          ON P.ID_PRODUTO = LP.ID_PRODUTO
                     JOIN LINHA_PRODUCAO LINPROD
                          ON LINPROD.ID_LINHA_PRODUCAO = OP.ID_LINHA_PRODUCAO
           ORDER BY OP.CODIGO`)
        ordemProducaoList = result as OrdemProducaoSimples[];

    } catch (exception) {
        console.error('❌ Falha ao buscar a listagem de ordens de produção:', exception);
        throw exception;
    }

    return ordemProducaoList;
}

export async function getProductionOrderDetailQuery(id: number): Promise<OrdemProducaoDetalhado | null> {

    let ordemProducao: OrdemProducaoDetalhado;

    try {
        const [result] = await pool.query(`
            SELECT OP.ID_ORDEM_PRODUCAO      AS idOrdemProducao
                 , OP.CODIGO                 AS codigoOrdemProducao
                 , LP.ID_LOTE_PRODUTO        AS idLoteProduto
                 , LP.CODIGO                 AS codigoLoteProduto
                 , LP.CODIGO_FABRICA         AS codigoFabrica
                 , LP.DATA_PRODUCAO          AS dataProducao
                 , P.ID_PRODUTO              AS idProduto
                 , P.CODIGO                  AS codigoProduto
                 , P.NOME                    AS nomeProduto
                 , P.PESO_BRUTO              AS pesoBruto
                 , P.UNIDADE_MEDIDA          AS unidadeMedida
                 , P.CODIGO_BARRAS           AS codigoBarras
                 , LINPROD.ID_LINHA_PRODUCAO AS idLinhaProducao
                 , LINPROD.CODIGO            AS codigoLinhaProducao
                 , LINPROD.CAPACIDADE_HORA   AS capacidadeHora
                 , LINPROD.DESCRICAO         AS descricao
                 , LINPROD.STATUS            AS status
                 , OP.QUANTIDADE_PRODUZIR    AS quantidadeProduzir
                 , OP.DT_HORA_INICIO         AS dataHoraInicio
                 , U.ID_USUARIO              AS idUsuario
                 , U.NOME                    AS nomeUsuario
                 , U.EMAIL                   AS email
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
        throw exception;
    }

    // @ts-ignore
    return ordemProducao;
}

export async function createProductionOrderQuery(codigo: string,
                                                 idLoteProduto: string,
                                                 idLinhaProducao: string,
                                                 idResponsavel: string,
                                                 quantidadeProduzir: string,
                                                 dataHoraInicio: string): Promise<number> {

    let idOrdemProducao: number = 0

    try {
        const [result] = await pool.execute(`
                    INSERT INTO ORDEM_PRODUCAO
                    ( CODIGO
                    , ID_LOTE_PRODUTO
                    , ID_LINHA_PRODUCAO
                    , ID_RESPONSAVEL
                    , QUANTIDADE_PRODUZIR
                    , DT_HORA_INICIO)
                    VALUES ( ?
                           , ?
                           , ?
                           , ?
                           , ?
                           , ?)`,
            [codigo,
                idLoteProduto,
                idLinhaProducao,
                idResponsavel,
                quantidadeProduzir,
                dataHoraInicio])

        // @ts-ignore
        idOrdemProducao = parseInt(result.insertId);

        await pool.execute(`
                    INSERT INTO MATERIA_PRIMA_ORDEM_PRODUCAO
                    ( ID_ORDEM_PRODUCAO
                    , ID_MATERIA_PRIMA
                    , QUANTIDADE_PREVISTA)
                    SELECT ?,
                           MP.ID_MATERIA_PRIMA,
                           (MPP.QUANTIDADE_UNIDADE * ?)
                    FROM LOTE_PRODUTO LP
                             JOIN PRODUTO P
                                  ON P.ID_PRODUTO = LP.ID_PRODUTO
                             JOIN MATERIA_PRIMA_PRODUTO MPP
                                  ON MPP.ID_PRODUTO = P.ID_PRODUTO
                             JOIN MATERIA_PRIMA MP
                                  ON MP.ID_MATERIA_PRIMA = MPP.ID_MATERIA_PRIMA
                    WHERE LP.ID_LOTE_PRODUTO = ?`,
            [idOrdemProducao,
                quantidadeProduzir,
                idLoteProduto]);

    } catch (exception) {
        console.error('❌ Falha ao criar a ordem de produção:', exception);
        throw exception;
    }

    return idOrdemProducao;
}