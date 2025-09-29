import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authRequired(req: { headers: { authorization: string; }; user: jwt.Jwt & jwt.JwtPayload & void; }, res: {
    status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; };
}, next: () => void) {
    const auth = req.headers.authorization || '';
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    try {
        // @ts-ignore
        const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export function roleRequired(...roles: any[]) {
    return (req: { user: { role: any; }; }, res: {
        status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; };
    }, next: () => void) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}
