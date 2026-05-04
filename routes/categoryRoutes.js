import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controllers/categoryController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createCategory);
router.get("/", isAuthenticated, getCategories);
router.put("/:id", isAuthenticated, updateCategory);
router.delete("/:id", isAuthenticated, deleteCategory);
router.put("/toggle/:id", isAuthenticated, toggleCategoryStatus);

export default router;