// controllers/inventoryController.js

import { Inventory } from "../models/Inventory.js";

/* =====================================
   RESET INVENTORY
===================================== */
export const resetInventory = async (req, res) => {
  try {
    await Inventory.updateMany(
      {},
      {
        $set: {
          todayDemand: 0,
          soldToday: 0,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Inventory reset successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Reset failed",
    });
  }
};

/* =====================================
   FETCH INVENTORY
===================================== */
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({
      todayDemand: -1,
      totalDemand: -1,
    });

    res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};