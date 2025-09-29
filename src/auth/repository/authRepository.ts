import {Usuario} from "../../types/Usuario";
import {pool} from "../../dataBase/mysqlClient";

export async function getUserQuery(sub: string, email: string | undefined): Promise<Usuario | null> {
    let usuario: Usuario;

    try {
        const [result] = await pool.query(`
            SELECT ID_USUARIO AS idUsuario
                 , EMAIL      AS email
                 , NOME       AS nomeUsuario
            FROM USUARIO
            WHERE EMAIL = ?
               OR SUB = ? LIMIT 1`, [email, sub])

        if (!Array.isArray(result) || !result.length) {
            return null;
        }

        const row: any = result[0];

        usuario = {
            idUsuario: row.idUsuario,
            nomeUsuario: row.nomeUsuario,
            email: row.email
        }
    } catch (exception) {
        console.log('Erro ao buscar usuario: ', exception);
        throw exception;
    }

    return usuario
}

export async function createUser(sub: string, email: string | undefined, nome: string, urlFoto: string): Promise<number> {
    let idUsuario: number;

    try {
        const [result] = await pool.execute(`
            INSERT INTO USUARIO ( EMAIL
                                , NOME
                                , SUB
                                , URL_FOTO)
            values ( ?
                   , ?
                   , ?
                   , ?)`, [email, nome, sub, urlFoto])

        // @ts-ignore
        idUsuario = parseInt(result.insertId);
    } catch (exception) {
        console.log('Erro ao criar o usuário: ', exception);
        throw exception;
    }

    return idUsuario;
}

export async function updateUser(id: number, email: string | undefined, nome: string, urlFoto: string) {
    let idUsuario: number;

    try {
        const [result] = await pool.execute(`
            UPDATE USUARIO
            SET EMAIL    = ?
              , NOME     = ?
              , URL_FOTO = ?
            WHERE ID_USUARIO = ?`, [email, nome, urlFoto, id])
    } catch (exception) {
        console.log('Erro ao atualizar o usuário: ', exception);
        throw exception;
    }
}