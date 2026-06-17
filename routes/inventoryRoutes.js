// routes/inventoryRoutes.js

import express from "express";
import {
  resetInventory,
  getInventory,
} from "../controllers/inventoryController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/* FETCH ALL INVENTORY */
router.get("/", isAuthenticated, getInventory);

/*  RESET INVENTORY */
router.put("/reset", isAuthenticated, resetInventory);

export default router;
