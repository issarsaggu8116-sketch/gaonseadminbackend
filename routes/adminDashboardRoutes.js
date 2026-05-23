import express from "express";
import {
  getDashboard,
  resetProductStock,
} from "../controllers/adminDashboardController.js";

const router = express.Router();

// 📊 GET ALL PRODUCTS STOCK
router.get("/dashboard", getDashboard);

// 🔄 RESET PARTICULAR PRODUCT STOCK
router.put("/reset-stock/:productId", resetProductStock);

export default router;
