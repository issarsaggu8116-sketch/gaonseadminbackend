import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  toggleProduct,
} from "../controllers/productController.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminOnly.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.post("/create", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.put("/toggle/:id", toggleProduct);

export default router;