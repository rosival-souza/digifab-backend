import express from 'express';
import {loginGoogle} from "../service/authService";

const router = express.Router();

router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        console.log(idToken);
        if (!idToken) return res.status(400).json({ error: 'idToken is required' });

        const token = await loginGoogle(idToken);
        res.status(200).json({token})

    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid Google token' });
    }
})

export default router;