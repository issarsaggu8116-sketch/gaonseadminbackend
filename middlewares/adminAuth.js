import jwt from "jsonwebtoken";
import { Admin } from "../models/User.js";

export const isAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Login required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).populate("city");

    if (!admin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};