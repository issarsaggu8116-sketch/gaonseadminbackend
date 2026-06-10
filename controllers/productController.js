import { Product } from "../models/Product.js";


// ➕ CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      img_url,
      stock,
      category,
    } = req.body;

    const product = await Product.create({
      name,
      price,
      discount,
      img_url,
      category,
      city: req.user.city,

      stockLimit: stock,
      currentStock: stock,
    });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📃 GET PRODUCTS (CITY BASED)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      city: req.user.city,
    }).populate("category");

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✏️ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      img_url,
      stock,
      category,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.city.toString() !== req.user.city.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        discount,
        img_url,
        category,
        stockLimit: stock,
        isActive,
      },
      { new: true }
    );

    res.json({
      success: true,
      product: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// ❌ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// 🔄 TOGGLE PRODUCT STATUS
export const toggleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;

    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
