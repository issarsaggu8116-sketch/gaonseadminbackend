import express from "express";
import {
  getPendingOrders,
  approveOrder,
  cancelOrder,
} from "../controllers/adminOrderController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/test", (req, res) => {
  console.log(" ADMIN ORDER TEST ROUTE HIT");
  res.json({
    success: true,
    message: "Admin Order route is working ",
    time: new Date(),
  });
});

router.get("/pending", isAuthenticated, getPendingOrders);
router.put("/approve/:id", isAuthenticated, approveOrder);
router.put("/cancel/:id", isAuthenticated, cancelOrder);

export default router;
