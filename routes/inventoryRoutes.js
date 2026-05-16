// routes/inventoryRoutes.js

import express from "express";
import {
  resetInventory,
  getInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

/* FETCH ALL INVENTORY */
router.get("/", getInventory);

/*  RESET INVENTORY */
router.put("/reset", resetInventory);

export default router;
