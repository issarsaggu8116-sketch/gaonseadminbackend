import { Product } from "../models/Product.js";

// 📊 GET ALL PRODUCTS WITH CURRENT STOCK
export const getDashboard = async (
  req,
  res
) => {
  try {
    // ✅ CITY
    const cityId = req.user.city;

    // 🥛 GET ALL PRODUCTS
    const products = await Product.find({
      city: cityId,
    }).select("name currentStock stockLimit");

    // 📦 FORMAT RESPONSE
    const productStockData =
      products.map((product) => ({
        productId: product._id,
        productName: product.name,
        currentStock: product.currentStock || 0,
        stockLimit: product.stockLimit || 100,
      }));

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

    // ✅ CHECK STOCK LIMIT
    if (
      product.stockLimit === undefined ||
      product.stockLimit === null
    ) {
      return res.status(400).json({
        message:
          "Stock limit not set for this product",
      });
    }

    // ✅ RESTOCK TO MAX LIMIT
    product.currentStock =
      product.stockLimit;

    await product.save();

    res.status(200).json({
      message:
        "Product restocked successfully",
      product: {
        productId: product._id,
        productName: product.name,
        stockLimit:
          product.stockLimit,
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
