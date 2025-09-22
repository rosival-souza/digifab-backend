import { Router } from 'express';
import {
    getDailyMpConsumption,
    getDailyProductionByLine,
    getMpConsumptionByType,
    getTopProducts
} from "../controllers/dashboard.controller";
const router = Router();

router.get('/dashboard/series/daily-production-by-line', getDailyProductionByLine);
router.get('/dashboard/rankings/top-products', getTopProducts);
router.get('/dashboard/series/daily-mp-consumption', getDailyMpConsumption);
router.get('/dashboard/aggregates/mp-consumption-by-type', getMpConsumptionByType);

export default router;
