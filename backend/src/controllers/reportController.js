import reportService from "../services/reportService.js";
import jobService from "../services/jobService.js";

export const submitReport = async (req, res, next) => {
  try {
    const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } =
      req.body;

    const report = await reportService.createOrUpdateReport({
      ngoId,
      month,
      peopleHelped: Number(peopleHelped),
      eventsConducted: Number(eventsConducted),
      fundsUtilized: Number(fundsUtilized),
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadBulkReports = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Create job
    const job = await jobService.createJob();

    jobService.processCSVFile(job.jobId, req.file.buffer).catch((err) => {
      console.error("Error processing CSV:", err);
    });

    res.status(202).json({
      success: true,
      message: "File upload accepted for processing",
      jobId: job.jobId,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await jobService.getJobStatus(jobId);

    res.json({
      success: true,
      data: {
        id: job.jobId,
        status: job.status,
        total: job.total,
        processed: job.processed,
        successful: job.successful,
        failed: job.failed,
        errors: job.errors,
      },
    });
  } catch (error) {
    next(error);
  }
};
