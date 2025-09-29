import {Router} from "express";
import {
    createConsumptionItem,
    createProductionOrder,
    getBalancesByRmLotByOpList,
    getConsumptionItemList,
    getConsumptionPointingDetail,
    getProductionLine,
    getProductionOrderDetail,
    getProductionOrderList,
    getProductLot
} from "../controllers/orderProduction.controller";
import {authRequired} from "../auth/util/auth";

const router = Router();
router.get("/order-production/production-line", getProductionLine)
router.get("/order-production/product-lot", getProductLot)
router.get("/order-production", getProductionOrderList)
router.post("/order-production", authRequired, createProductionOrder)
router.get("/order-production/:id", getProductionOrderDetail)
router.get("/order-production/:id/balances-by-lot-mp", getBalancesByRmLotByOpList)
router.get("/order-production/:id/consumption-pointing-detail", getConsumptionPointingDetail)
router.get("/order-production/:id/consumption-items", getConsumptionItemList)
router.post("/order-production/:id/consumption-item", authRequired, createConsumptionItem)

export default router;