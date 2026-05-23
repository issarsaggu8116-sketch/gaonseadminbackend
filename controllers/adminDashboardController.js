import { Product } from "../models/Product.js";

// 📊 GET ALL PRODUCTS WITH CURRENT STOCK
export const getDashboard = async (req, res) => {
  try {
    const city = req.user.city;
    await console.log("route hitten")

    // 🥛 GET ALL PRODUCTS
    const products = await Product.find({ city: cityId }).select(
      "name currentStock"
    );

    // 📦 FORMAT RESPONSE
    const productStockData = products.map((product) => ({
      productId: product._id,
      productName: product.name,
      currentStock: product.currentStock || 0,
    }));

    res.status(200).json({
      totalProducts: productStockData.length,
      products: productStockData,
    });
  } catch (err) {
    console.log("Dashboard Error:", err.message);

    res.status(500).json({
      message: err.message,
    });
  }
};

// 🔄 RESET PARTICULAR PRODUCT STOCK
export const resetProductStock = async (req, res) => {
  try {
    const { productId } = req.params;

    // OPTIONAL:
    // if you want custom stock value from frontend
    // const { stock } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // RESET STOCK
    product.currentStock = 100;

    // OR CUSTOM VALUE
    // product.currentStock = stock;

    await product.save();

    res.status(200).json({
      message: "Product stock reset successfully",
      product: {
        productId: product._id,
        productName: product.name,
        currentStock: product.currentStock,
      },
    });
  } catch (err) {
    console.log("Reset Stock Error:", err.message);

    res.status(500).json({
      message: err.message,
    });
  }
};
