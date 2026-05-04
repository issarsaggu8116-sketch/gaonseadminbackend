import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminOnly.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.get("/", getSettings);
router.put("/", updateSettings);

export default router;