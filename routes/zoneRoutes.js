import express from "express";
import {
  createZone,
  getZones,
  updateZone,
  deleteZone,
  toggleZoneStatus,
} from "../controllers/zoneController.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminOnly.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.post("/create", createZone);
router.get("/", getZones);
router.put("/:id", updateZone);
router.delete("/:id", deleteZone);
router.put("/toggle/:id", toggleZoneStatus);

export default router;