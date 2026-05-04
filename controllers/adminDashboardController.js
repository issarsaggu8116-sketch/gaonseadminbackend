import { Order } from "../models/Order.js";
import { Subscription } from "../models/Subscription.js";
import { Product } from "../models/Product.js";

export const getDashboard = async (req, res) => {
  try {
    const cityId = req.user.city;

    // 🗓️ TODAY RANGE
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 📦 TODAY ORDERS
    const todayOrders = await Order.countDocuments({
      "address.city._id": cityId.toString(),
      createdAt: { $gte: start, $lte: end },
      status: { $ne: "cancelled" },
    });

    // 🔁 ACTIVE SUBSCRIPTIONS
    const activeSubscriptions = await Subscription.countDocuments({
      city: cityId,
      isActive: true,
    });

    // 🥛 TOMORROW MILK CALCULATION
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayName = tomorrow.toLocaleString("en-US", {
      weekday: "short",
    }); // Mon, Tue...

    const dateNumber = tomorrow.getDate();

    const subs = await Subscription.find({
      city: cityId,
      isActive: true,
    });

    let tomorrowMilk = 0;

    subs.forEach((sub) => {
      if (sub.type === "daily") {
        tomorrowMilk += sub.quantity;
      }

      if (sub.type === "days" && sub.days.includes(dayName)) {
        tomorrowMilk += sub.quantity;
      }

      if (sub.type === "dates" && sub.dates.includes(dateNumber)) {
        tomorrowMilk += sub.quantity;
      }
    });

    // 📦 STOCK LEFT (SUM OF PRODUCTS)
    const products = await Product.find({ city: cityId });

    let stockLeft = 0;
    products.forEach((p) => {
      stockLeft += p.currentStock || 0;
    });

    res.json({
      todayOrders,
      tomorrowMilk,
      activeSubscriptions,
      stockLeft,
    });
  } catch (err) {
    console.log("Dashboard Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};