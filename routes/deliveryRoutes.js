import express from "express";
import {
  createDeliveryPartner,
  getDeliveryPartners,
  toggleDeliveryStatus,
  deleteDeliveryPartner,
  loginDeliveryPartner,
  getPartnerSales,
  getPartnerSalaryWeeks,
} from "../controllers/deliveryController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//
//  DELIVERY LOGIN (NO AUTH)
//
router.post("/login", loginDeliveryPartner);

//
//  ADMIN ROUTES
//
router.post("/create", isAuthenticated, createDeliveryPartner);
router.get("/", isAuthenticated, getDeliveryPartners);
router.get("/sales/:partnerId", isAuthenticated, getPartnerSales);
router.get("/salary/:partnerId", isAuthenticated, getPartnerSalaryWeeks);
router.put("/toggle/:id", isAuthenticated, toggleDeliveryStatus);
router.delete("/:id", isAuthenticated, deleteDeliveryPartner);

export default router;
