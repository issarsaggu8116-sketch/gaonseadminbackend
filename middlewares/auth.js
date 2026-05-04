import jwt from "jsonwebtoken";
import { Admin } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Login first" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};