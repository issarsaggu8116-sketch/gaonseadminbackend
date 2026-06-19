import mongoose from "mongoose";
import { User } from "../models/User.js";

// 👥 GET ALL USERS OF ADMIN'S CITY WITH OPTIONAL WALLET BALANCE SORT
export const getCityUsers = async (req, res) => {
  try {
    const adminCityId = req.user.city;

    if (!adminCityId) {
      return res.status(400).json({ success: false, message: "City not set for this admin" });
    }

    const { sortBy } = req.query;

    const aggregationPipeline = [
      {
        $match: {
          city: new mongoose.Types.ObjectId(adminCityId),
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "_id",
          foreignField: "user",
          as: "walletInfo",
        },
      },
      {
        $addFields: {
          walletBalance: {
            $ifNull: [{ $arrayElemAt: ["$walletInfo.balance", 0] }, 0],
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          walletBalance: 1,
        },
      },
    ];

    if (sortBy === "balance_asc") {
      aggregationPipeline.push({ $sort: { walletBalance: 1 } });
    } else if (sortBy === "balance_desc") {
      aggregationPipeline.push({ $sort: { walletBalance: -1 } });
    } else {
      // Default: sort by name
      aggregationPipeline.push({ $sort: { name: 1 } });
    }

    const users = await User.aggregate(aggregationPipeline);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

