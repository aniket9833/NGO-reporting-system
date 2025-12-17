import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "completed_with_errors",
        "failed",
      ],
      default: "pending",
    },
    total: {
      type: Number,
      default: 0,
    },
    processed: {
      type: Number,
      default: 0,
    },
    successful: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
    errors: [
      {
        row: Number,
        message: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
