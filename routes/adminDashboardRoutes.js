import express from "express";
import { getDashboard } from "../controllers/adminDashboardController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/dashboard", isAuthenticated, getDashboard);

export default router;