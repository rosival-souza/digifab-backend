import {Router} from "express";
import {
    createProductionOrder,
    getProductionLine,
    getProductionOrderDetail,
    getProductionOrderList,
    getProductLot
} from "../controllers/orderProduction.controller";

const router = Router();
router.get("/order-production/production-line", getProductionLine)
router.get("/order-production/product-lot", getProductLot)
router.get("/order-production", getProductionOrderList)
router.post("/order-production", createProductionOrder)
router.get("/order-production/:id", getProductionOrderDetail)

export default router;