// src/routes/productRoutes.ts
import { Router } from 'express';
import { getSupplier } from '../dataBase/mysqlClient'
const router = Router();

router.get('/supplier', getSupplier);

export default router;
