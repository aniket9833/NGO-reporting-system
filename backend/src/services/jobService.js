import Job from "../models/Job.js";
import reportService from "./reportService.js";
import { parseCSV } from "../utils/csvParser.js";

class JobService {
  async createJob() {
    const jobId = `job_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const job = await Job.create({ jobId, status: "pending" });
    return job;
  }

  async getJobStatus(jobId) {
    const job = await Job.findOne({ jobId });
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  async processCSVFile(jobId, fileBuffer) {
    try {
      const job = await Job.findOne({ jobId });
      if (!job) throw new Error("Job not found");

      job.status = "processing";
      await job.save();

      const records = await parseCSV(fileBuffer);
      job.total = records.length;
      await job.save();

      for (let i = 0; i < records.length; i++) {
        const record = records[i];

        try {
          // Validate record
          this.validateRecord(record, i + 2);

          // Process report
          await reportService.createOrUpdateReport({
            ngoId: record.ngoId || record.ngoid,
            month: record.month,
            peopleHelped: parseInt(record.peopleHelped || record.peoplehelped),
            eventsConducted: parseInt(
              record.eventsConducted || record.eventsconducted
            ),
            fundsUtilized: parseFloat(
              record.fundsUtilized || record.fundsutilized
            ),
          });

          job.successful++;
        } catch (error) {
          job.failed++;
          job.errors.push({
            row: i + 2,
            message: error.message,
          });
        }

        job.processed++;

        // Save progress every 10 records or on last record
        if (job.processed % 10 === 0 || job.processed === job.total) {
          await job.save();
        }
      }

      job.status = job.failed > 0 ? "completed_with_errors" : "completed";
      await job.save();
    } catch (error) {
      const job = await Job.findOne({ jobId });
      if (job) {
        job.status = "failed";
        job.errors.push({ row: 0, message: error.message });
        await job.save();
      }
    }
  }

  validateRecord(record, rowNumber) {
    const ngoId = record.ngoId || record.ngoid;
    const month = record.month;
    const peopleHelped = record.peopleHelped || record.peoplehelped;
    const eventsConducted = record.eventsConducted || record.eventsconducted;
    const fundsUtilized = record.fundsUtilized || record.fundsutilized;

    if (!ngoId) {
      throw new Error("NGO ID is required");
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw new Error("Invalid month format (expected YYYY-MM)");
    }
    if (isNaN(peopleHelped) || peopleHelped < 0) {
      throw new Error("Invalid peopleHelped value");
    }
    if (isNaN(eventsConducted) || eventsConducted < 0) {
      throw new Error("Invalid eventsConducted value");
    }
    if (isNaN(fundsUtilized) || fundsUtilized < 0) {
      throw new Error("Invalid fundsUtilized value");
    }
  }
}

export default new JobService();
