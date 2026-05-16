import jwt from "jsonwebtoken";
import { DeliveryPartner } from "../models/DeliveryPartner.js";
import { Zone } from "../models/Zone.js";

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
