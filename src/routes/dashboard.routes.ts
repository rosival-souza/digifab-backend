import { Router } from 'express';
import {
    getOrdersCount,
    getPlannedUnits,
    getDailyMpConsumption,
    getDailyProductionByLine,
    getMpConsumptionByType,
    getTopProducts,
    getRawMpMonsumed,
    getLineUtilizationAverage,
    getLineUtilizationSimpleAverage,
    getServedProductLots
} from "../controllers/dashboard.controller";
const router = Router();

router.get('/dashboard/kpis/orders-count', getOrdersCount);
router.get('/dashboard/kpis/planned-units', getPlannedUnits);
router.get('/dashboard/kpis/raw-mp-consumed', getRawMpMonsumed);
router.get('/dashboard/kpis/served-product-lots', getServedProductLots);
router.get('/dashboard/kpis/line-utilization-average', getLineUtilizationAverage);
router.get('/dashboard/kpis/line-utilization-simple-average', getLineUtilizationSimpleAverage);
router.get('/dashboard/series/daily-production-by-line', getDailyProductionByLine);
router.get('/dashboard/rankings/top-products', getTopProducts);
router.get('/dashboard/series/daily-mp-consumption', getDailyMpConsumption);
router.get('/dashboard/aggregates/mp-consumption-by-type', getMpConsumptionByType);

export default router;
