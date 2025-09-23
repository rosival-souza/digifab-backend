import {Router} from "express";
import {
    getProductionLine,
    getProductionOrderDetail,
    getProductionOrderList
} from "../controllers/orderProduction.controller";

const router = Router();
router.get("/order-production/production-line", getProductionLine)
router.get("/order-production", getProductionOrderList)
router.get("/order-production/:id", getProductionOrderDetail)

export default router;