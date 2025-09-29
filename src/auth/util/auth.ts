// src/auth/util/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Tipar o payload que você usa na app
export interface AuthUser {
    sub: string;
    email?: string;
    roles?: string[];
    [k: string]: unknown;
}

// Estender o Request p/ receber user
declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthUser;
    }
}

// Tipar a env (evita undefined nas libs TS)
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET?: string; // continua opcional em tempo de build; validamos em runtime
        }
    }
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token ausente' });
    }

    const token = auth.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Falta de configuração do servidor
        console.error('JWT_SECRET não configurado');
        return res.status(500).json({ error: 'Configuração do servidor ausente' });
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload | string;

        // Se o token foi assinado com string subject
        if (typeof decoded === 'string') {
            req.user = { sub: decoded };
        } else {
            // Mapear para seu modelo (ajuste conforme seu token)
            req.user = {
                sub: String(decoded.sub ?? ''),
                email: (decoded as any).email,
                roles: (decoded as any).roles ?? [],
                ...decoded,
            };
        }

        return next();
    } catch {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

export function getUserId(req: Request) {
    console.log(req);
    return req.user?.uid ?? null;
}
