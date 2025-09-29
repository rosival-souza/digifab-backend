import {OAuth2Client} from "google-auth-library";
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import {Usuario} from "../../types/Usuario";
import {createUser, getUserQuery, updateUser} from "../repository/authRepository";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function loginGoogle(idToken: any): Promise<any> {
    let token = null
    console.log("GOOGLE_CLIENT_ID: ", process.env.GOOGLE_CLIENT_ID)
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        console.log("ticket", ticket);
        const payload = ticket.getPayload();
        console.log("payload", payload);
        if (!payload) {
            throw new Error(`Unable to verify token: ${idToken}`);
        }

        const sub = payload.sub;
        const email = payload.email;
        const name = payload.name || '';
        const picture = payload.picture || '';
        let userId: any = null;
        const role = 'OPERADOR';

        let usuario: Usuario | null = await getUserQuery(sub, email);

        if (!usuario) {
            userId = await createUser(sub, email, name, picture)
        } else {
            userId = usuario.idUsuario
            await updateUser(userId, email, name, picture)
        }

        token = jwt.sign(
            { uid: userId, sub, email, name, picture, role },
            // @ts-ignore
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        console.log("token", token);
    } catch (error) {
        console.error(error);
        throw error;
    }

    return token;
}