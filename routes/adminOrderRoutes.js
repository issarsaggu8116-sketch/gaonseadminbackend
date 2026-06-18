import express from "express";
import {
  getPendingOrders,
  approveOrder,
  cancelOrder,
  getAllOrders,
  unassignOrder,
} from "../controllers/adminOrderController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin Order route is working ",
    time: new Date(),
  });
});

router.get("/pending", isAuthenticated, getPendingOrders);
router.get("/all", isAuthenticated, getAllOrders);
router.put("/approve/:id", isAuthenticated, approveOrder);
router.put("/cancel/:id", isAuthenticated, cancelOrder);
router.put("/unassign/:id", isAuthenticated, unassignOrder);

export default router;
