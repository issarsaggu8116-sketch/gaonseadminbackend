import { Category } from "../models/Category.js";

// ➕ CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, isSubscriptionAllowed } = req.body;

    const category = await Category.create({
      name,
      isSubscriptionAllowed,
      city: req.user.city, // 🔥 auto assign
    });

    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📃 GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      city: req.user.city,
    });

    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { name, isSubscriptionAllowed } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (category.city.toString() !== req.user.city.toString())
      return res.status(403).json({ message: "Access denied" });

    category.name = name || category.name;
    category.isSubscriptionAllowed =
      isSubscriptionAllowed ?? category.isSubscriptionAllowed;

    await category.save();

    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (category.city.toString() !== req.user.city.toString())
      return res.status(403).json({ message: "Access denied" });

    await category.deleteOne();

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 TOGGLE ACTIVE
export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    category.isActive = !category.isActive;
    await category.save();

    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};