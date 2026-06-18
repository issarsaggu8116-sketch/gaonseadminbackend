import { Setting } from "../models/Setting.js";


//  GET SETTINGS
export const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne({ city: req.user.city });

    //  auto create if not exist
    if (!setting) {
      setting = await Setting.create({
        city: req.user.city,
      });
    }

    res.json({ success: true, setting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//  UPDATE SETTINGS
export const updateSettings = async (req, res) => {
  try {
    const { morningDeadline, eveningDeadline, rupeesPerKm } = req.body;

    let setting = await Setting.findOne({ city: req.user.city });

    if (!setting) {
      setting = await Setting.create({
        city: req.user.city,
        morningDeadline,
        eveningDeadline,
        rupeesPerKm,
      });
    } else {
      setting.morningDeadline = morningDeadline;
      setting.eveningDeadline = eveningDeadline;
      if (rupeesPerKm !== undefined) {
        setting.rupeesPerKm = rupeesPerKm;
      }
      await setting.save();
    }

    res.json({ success: true, setting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
