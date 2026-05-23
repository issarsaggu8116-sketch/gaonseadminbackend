import { Product } from "../models/Product.js";

// 📊 GET ALL PRODUCTS WITH CURRENT STOCK
export const getDashboard = async (req, res) => {
  try {
    console.log("Dashboard route hit");

    // ✅ CHECK USER
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized - req.user missing",
      });
    }

    // ✅ GET CITY
    const cityId =
      req.user.city?._id || req.user.city;

    if (!cityId) {
      return res.status(400).json({
        message: "City not found",
      });
    }

    // 🥛 GET ALL PRODUCTS
    const products = await Product.find({
      city: cityId,
    }).select("name currentStock");

    // 📦 FORMAT RESPONSE
    const productStockData = products.map(
      (product) => ({
        productId: product._id,
        productName: product.name,
        currentStock:
          product.currentStock || 0,
      })
    );

    res.status(200).json({
      totalProducts:
        productStockData.length,
      products: productStockData,
    });
  } catch (err) {
    console.log(
      "Dashboard Error:",
      err.message
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// 🔄 RESET PARTICULAR PRODUCT STOCK
export const resetProductStock = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    // ✅ FIND PRODUCT
    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ✅ RESET STOCK
    product.currentStock = 100;

    // OPTIONAL CUSTOM VALUE
    // const { stock } = req.body;
    // product.currentStock = stock;

    await product.save();

    res.status(200).json({
      message:
        "Product stock reset successfully",
      product: {
        productId: product._id,
        productName: product.name,
        currentStock:
          product.currentStock,
      },
    });
  } catch (err) {
    console.log(
      "Reset Stock Error:",
      err.message
    );

    res.status(500).json({
      message: err.message,
    });
  }
};
