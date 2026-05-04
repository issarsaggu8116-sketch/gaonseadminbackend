import { Order } from "../models/order.js";
import { Subscription } from "../models/subscriptionModel.js";

export const getTomorrowDemand = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayName = tomorrow.toLocaleString("en-US", {
    weekday: "long",
  });

  // 📦 DIRECT ORDERS
  const directOrders = await Order.find({
    deliveryDate: {
      $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
      $lte: new Date(tomorrow.setHours(23, 59, 59, 999)),
    },
  });

  // 🔁 SUBSCRIPTIONS
  const subscriptions = await Subscription.find({
    isActive: true,
    $or: [
      { dates: tomorrow.toISOString().split("T")[0] },
      { days: dayName },
    ],
    isPaused: false,
  });

  // 🧮 TOTAL CALCULATION
  let total = 0;

  directOrders.forEach((o) => {
    total += o.quantity;
  });

  subscriptions.forEach((s) => {
    total += s.quantity;
  });

  return {
    date: tomorrow,
    totalLitres: total,
    directOrders: directOrders.length,
    subscriptions: subscriptions.length,
  };
};