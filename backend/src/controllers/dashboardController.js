import reportService from "../services/reportService.js";

export const getDashboard = async (req, res, next) => {
  try {
    const { month } = req.query;

    // Validate month format if provided
    if (month && !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month format. Use YYYY-MM",
      });
    }

    const data = await reportService.getDashboardData(month);

    res.json({
      success: true,
      data: {
        month: month || "all",
        ...data,
      },
    });
  } catch (error) {
    next(error);
  }
};
