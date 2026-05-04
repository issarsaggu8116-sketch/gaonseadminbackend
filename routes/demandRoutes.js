import express from "express";
import { getDemand } from "../controllers/demandController.js";

const router = express.Router();

router.get("/tomorrow", getDemand);

export default router;