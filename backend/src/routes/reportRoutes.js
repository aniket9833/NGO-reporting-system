import express from "express";
import multer from "multer";
import {
  submitReport,
  uploadBulkReports,
  getJobStatus,
} from "../controllers/reportController.js";
import { validateReport } from "../middleware/validator.js";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/report", validateReport, submitReport);
router.post("/reports/upload", upload.single("file"), uploadBulkReports);
router.get("/job-status/:jobId", getJobStatus);

export default router;
