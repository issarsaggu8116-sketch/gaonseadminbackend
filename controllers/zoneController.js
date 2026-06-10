import { Zone } from "../models/Zone.js";

// ➕ CREATE ZONE
export const createZone = async (req, res) => {
  try {
    const { name, center, radius } = req.body;

    if (
      !name ||
      !center ||
      center.lat === undefined ||
      center.lng === undefined ||
      !radius
    ) {
      return res.status(400).json({
        message:
          "Name, center coordinates and radius are required",
      });
    }

    const zone = await Zone.create({
      name,
      center: {
        lat: Number(center.lat),
        lng: Number(center.lng),
      },
      radius: Number(radius),
      city: req.user.city,
    });

    res.json({
      success: true,
      zone,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// 📃 GET ALL ZONES (ADMIN CITY ONLY)
export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find({
      city: req.user.city,
    });

    res.json({
      success: true,
      zones,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ✏️ UPDATE ZONE
export const updateZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        message: "Zone not found",
      });
    }

    if (
      zone.city.toString() !==
      req.user.city.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const updateData = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.body.radius) {
      updateData.radius = Number(req.body.radius);
    }

    if (req.body.center) {
      updateData.center = {
        lat: Number(req.body.center.lat),
        lng: Number(req.body.center.lng),
      };
    }

    if (typeof req.body.isActive === "boolean") {
      updateData.isActive = req.body.isActive;
    }

    const updated = await Zone.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      zone: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ❌ DELETE ZONE
export const deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        message: "Zone not found",
      });
    }

    if (
      zone.city.toString() !==
      req.user.city.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await zone.deleteOne();

    res.json({
      success: true,
      message: "Zone deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// 🔄 TOGGLE ACTIVE
export const toggleZoneStatus = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        message: "Zone not found",
      });
    }

    if (
      zone.city.toString() !==
      req.user.city.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    zone.isActive = !zone.isActive;

    await zone.save();

    res.json({
      success: true,
      zone,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
