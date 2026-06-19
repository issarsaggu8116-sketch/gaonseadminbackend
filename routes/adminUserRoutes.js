import express from "express";
import { getCityUsers, exportCityUsersToCSV } from "../controllers/adminUserController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, getCityUsers);
router.get("/export", isAuthenticated, exportCityUsersToCSV);

export default router;
