import express from "express";
import {
  getDashboard,
  resetProductStock,
} from "../controllers/adminDashboardController.js";

const router = express.Router();

// 📊 GET ALL PRODUCTS STOCK
router.get("/dashboard",isAuthenticated, getDashboard);

// 🔄 RESET PARTICULAR PRODUCT STOCK
router.put("/reset-stock/:productId",isAuthenticated, resetProductStock);

export default router;
