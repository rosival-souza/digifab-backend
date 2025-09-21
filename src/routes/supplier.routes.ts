import { Router } from 'express';
import { fetchSupplier } from '../controllers/supplier.controller';
const router = Router();

router.get('/supplier', fetchSupplier)

export default router;
