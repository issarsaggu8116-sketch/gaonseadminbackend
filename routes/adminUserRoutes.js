import express from "express";
import { getCityUsers } from "../controllers/adminUserController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, getCityUsers);

export default router;
