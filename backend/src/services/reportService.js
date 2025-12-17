import Report from "../models/Report.js";

class ReportService {
  async createOrUpdateReport(reportData) {
    const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } =
      reportData;

    // Upsert: update if exists, create if doesn't (idempotency)
    const report = await Report.findOneAndUpdate(
      { ngoId, month },
      { peopleHelped, eventsConducted, fundsUtilized },
      { upsert: true, new: true, runValidators: true }
    );

    return report;
  }

  async getDashboardData(month = null) {
    const matchStage = month ? { month } : {};

    const aggregation = await Report.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalNGOs: { $addToSet: "$ngoId" },
          totalPeopleHelped: { $sum: "$peopleHelped" },
          totalEventsConducted: { $sum: "$eventsConducted" },
          totalFundsUtilized: { $sum: "$fundsUtilized" },
          reportCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalNGOs: { $size: "$totalNGOs" },
          totalPeopleHelped: 1,
          totalEventsConducted: 1,
          totalFundsUtilized: 1,
          reportCount: 1,
        },
      },
    ]);

    if (aggregation.length === 0) {
      return {
        totalNGOs: 0,
        totalPeopleHelped: 0,
        totalEventsConducted: 0,
        totalFundsUtilized: 0,
        reportCount: 0,
      };
    }

    return aggregation[0];
  }
}

export default new ReportService();
