import {Router} from "express";
import {getTrakeability} from "../controllers/rastreabilidade.controller";

const router = Router();
router.get("/trackability", getTrakeability)

export default router;