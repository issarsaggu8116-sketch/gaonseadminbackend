import express from "express";
import {
  createDeliveryPartner,
  getDeliveryPartners,
  toggleDeliveryStatus,
  deleteDeliveryPartner,
  loginDeliveryPartner,
} from "../controllers/deliveryController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//
// 🔐 DELIVERY LOGIN (NO AUTH)
//
router.post("/login", loginDeliveryPartner);

//
// 🛠 ADMIN ROUTES
//
router.post("/create", isAuthenticated, createDeliveryPartner);
router.get("/", isAuthenticated, getDeliveryPartners);
router.put("/toggle/:id", isAuthenticated, toggleDeliveryStatus);
router.delete("/:id", isAuthenticated, deleteDeliveryPartner);

export default router;