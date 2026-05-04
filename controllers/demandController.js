import { getTomorrowDemand } from "../utils/demandCalculator.js";

export const getDemand = async (req, res) => {
  const data = await getTomorrowDemand();

  res.json({
    success: true,
    demand: data,
  });
};