import { Router } from 'express';
const router = Router();
import dotenv from 'dotenv';
dotenv.config();

router.get('/healths', (_, res) => {

    res.send({
        success: true,
        message: 'Initial healths Router!',
        // name: name,
        // version: version,
        environment: process.env
    })
});

export default router;
