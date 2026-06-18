import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

//  COMMON CITY FILTER
const getCityFilter = (city) => ({
  $or: [
    { "address.city": city },
    { "address.city": city.toString() },
  ],
});


//  GET PENDING ORDERS BY ADMIN CITY
export const getPendingOrders = async (req, res) => {
  try {
    
    const adminCity = req.user.city;
    const orders = await Order.find({
      ...getCityFilter(adminCity),
      status: "pending",
    })
      .populate("user", "name phone")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.log("FETCH ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


//  APPROVE ORDER + STOCK DEDUCTION
export const approveOrder = async (req, res) => {
  try {
    const adminCity = req.user.city;

    const order = await Order.findOne({
      _id: req.params.id,
      ...getCityFilter(adminCity),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be approved",
      });
    }

    //  STEP 1: CHECK STOCK
    for (let item of order.items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(400).json({
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.currentStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    //  STEP 2: DEDUCT STOCK (SAFE)
    for (let item of order.items) {
      const updated = await Product.findOneAndUpdate(
        {
          _id: item._id,
          currentStock: { $gte: item.qty },
        },
        {
          $inc: { currentStock: -item.qty },
        }
      );

      if (!updated) {
        return res.status(400).json({
          message: `Stock race issue for ${item.name}`,
        });
      }
    }

    //  STEP 3: UPDATE ORDER
    order.status = "approved";
    await order.save();

    //  REALTIME
    req.io?.emit("orderApproved", order);

    res.json({
      success: true,
      message: "Order Approved & Stock Updated ",
      order,
    });
  } catch (err) {
    console.log("APPROVE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const adminCity = req.user.city;

    const order = await Order.findOne({
      _id: req.params.id,
      ...getCityFilter(adminCity),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    //  REALTIME
    req.io?.emit("orderCancelled", order);

    res.json({
      success: true,
      message: "Order Cancelled ",
      order,
    });
  } catch (err) {
    console.log("CANCEL ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL ORDERS FOR ADMIN CITY
export const getAllOrders = async (req, res) => {
  try {
    const adminCity = req.user.city;
    const orders = await Order.find({
      ...getCityFilter(adminCity),
    })
      .populate("user", "name phone")
      .populate("deliveredBy", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.log("FETCH ALL ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// UNASSIGN ORDER FROM PARTNER
export const unassignOrder = async (req, res) => {
  try {
    const adminCity = req.user.city;

    const order = await Order.findOne({
      _id: req.params.id,
      ...getCityFilter(adminCity),
    }).populate("user", "name phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveredBy = null;
    order.status = "pending";
    await order.save();

    // Notify delivery backend of unassigned order so it is broadcast to delivery partner zone room
    try {
      fetch("http://localhost:4001/api/delivery/today-orders/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      }).catch((err) => console.log("Notify delivery error:", err.message));
    } catch (err) {
      console.log("Failed to notify delivery backend:", err.message);
    }

    res.json({
      success: true,
      message: "Order unassigned successfully",
      order,
    });
  } catch (err) {
    console.log("UNASSIGN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};
