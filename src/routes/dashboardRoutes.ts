// src/routes/productRoutes.ts
import { Router } from 'express';
import { getCryptoProcess } from '../dataBase/mysqlClient'
const router = Router();

router.get('/dashboard/production-per-day', getCryptoProcess);
// router.post('/products', addProducts);

export default router;
