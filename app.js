import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

// Ensure all models are registered
import "./models/User.js";
import "./models/Subscription.js";

import zoneRoutes from "./routes/zoneRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
// import demandRoutes from "./routes/demandRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js"
import inventoryRoutes from "./routes/inventoryRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";






dotenv.config();

export const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));


// 👇 ADD THIS MIDDLEWARE
app.use((req, res, next) => {
  req.io = global.io;
  next();
});

app.use(express.json());
app.use(cookieParser());

connectDB();

// ROUTES
app.use("/api/v1/admin", adminAuthRoutes);
// app.use("/api/v1/admin/auth", authRoutes);
app.use("/api/v1/admin/zone", zoneRoutes);

app.use("/api/v1/admin/category", categoryRoutes);
app.use("/api/v1/admin/product", productRoutes);

app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/admin/setting", settingRoutes);

app.use("/api/v1/admin",adminDashboardRoutes);


// app.use("/api/v1/demand", demandRoutes);

app.use("/api/v1/admin/delivery", deliveryRoutes);

app.use("/api/v1/admin/inventory", inventoryRoutes);

app.use("/api/v1/admin/users", adminUserRoutes);