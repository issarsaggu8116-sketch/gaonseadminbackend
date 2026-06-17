import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { DeliveryPartner } from "../models/DeliveryPartner.js";
import { Zone } from "../models/Zone.js";
import { Khata } from "../models/Khata.js";

//
//  CREATE DELIVERY PARTNER
//
export const createDeliveryPartner = async (req, res) => {
  try {
    const { name, phone, password, zone } = req.body;

    if (!name || !phone || !password || !zone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await DeliveryPartner.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    const zoneData = await Zone.findById(zone);

    if (!zoneData) {
      return res.status(404).json({ message: "Zone not found" });
    }

    if (zoneData.city.toString() !== req.user.city.toString()) {
      return res.status(403).json({ message: "Invalid zone access" });
    }

    const partner = await DeliveryPartner.create({
      name,
      phone,
      password,
      zone,
      city: req.user.city,
    });

    res.json({ success: true, partner });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//
//  LOGIN
//
export const loginDeliveryPartner = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone & password required" });
    }

    const partner = await DeliveryPartner.findOne({ phone }).select("+password");

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    if (!partner.isActive) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const isMatch = await partner.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: partner._id, role: "delivery" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      partner: {
        _id: partner._id,
        name: partner.name,
        phone: partner.phone,
        zone: partner.zone,
        city: partner.city,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//
//  GET PARTNERS
//
export const getDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({
      city: req.user.city,
    }).populate("zone");

    res.json({ success: true, partners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
//  TOGGLE ACTIVE
//
export const toggleDeliveryStatus = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Not found" });
    }

    if (partner.city.toString() !== req.user.city.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    partner.isActive = !partner.isActive;
    await partner.save();

    res.json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
//  DELETE
//
export const deleteDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Not found" });
    }

    if (partner.city.toString() !== req.user.city.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await partner.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
//  GET PARTNER SALES METRICS (TODAY & TOTAL)
//
export const getPartnerSales = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    if (partner.city.toString() !== req.user.city.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Aggregate total sales
    const totalSalesResult = await Khata.aggregate([
      { $match: { partner: new mongoose.Types.ObjectId(partnerId) } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          items: { $sum: "$qty" }
        }
      }
    ]);

    // Aggregate today's sales
    const todaySalesResult = await Khata.aggregate([
      {
        $match: {
          partner: new mongoose.Types.ObjectId(partnerId),
          deliveredAt: { $gte: startOfToday, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          items: { $sum: "$qty" }
        }
      }
    ]);

    const totalSales = totalSalesResult[0]?.total || 0;
    const totalItems = totalSalesResult[0]?.items || 0;
    const todaySales = todaySalesResult[0]?.total || 0;
    const todayItems = todaySalesResult[0]?.items || 0;

    res.json({
      success: true,
      partnerId,
      partnerName: partner.name,
      todaySales,
      todayItems,
      totalSales,
      totalItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
