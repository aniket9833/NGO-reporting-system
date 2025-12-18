import React, { useState, useEffect } from "react";
import { Upload, AlertCircle, Loader } from "lucide-react";
import backend from "../services/backend";

const BulkUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [jobStatus, setJobStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (jobId) {
      const interval = setInterval(async () => {
        try {
          const status = await backend.getJobStatus(jobId);
          setJobStatus(status);

          if (
            status.status === "completed" ||
            status.status === "completed_with_errors" ||
            status.status === "failed"
          ) {
            clearInterval(interval);
            if (onSuccess) onSuccess();
          }
        } catch (err) {
          console.error("Error fetching job status:", err);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [jobId, onSuccess]);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setJobStatus(null);

    try {
      const result = await backend.uploadCSV(file);
      setJobId(result.jobId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const csv =
      "ngoId,month,peopleHelped,eventsConducted,fundsUtilized\nNGO001,2024-01,150,5,12000.50\nNGO002,2024-01,200,8,15000.00";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_reports.csv";
    a.click();
  };

  const reset = () => {
    setFile(null);
    setJobId("");
    setJobStatus(null);
    setError("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Bulk Upload Reports
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {!jobId ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Choose CSV file
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            onClick={downloadSample}
            className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Download Sample CSV Template
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload CSV
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Job ID: {jobId}</p>
            {jobStatus && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Status:{" "}
                    {(jobStatus.status || "processing")
                      .replace("_", " ")
                      .toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    {jobStatus.processed || 0} / {jobStatus.total || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        jobStatus.total
                          ? (jobStatus.processed / jobStatus.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex gap-4 text-sm">
                  <span className="text-green-600">
                    ✓ Success: {jobStatus.successful || 0}
                  </span>
                  <span className="text-red-600">
                    ✗ Failed: {jobStatus.failed || 0}
                  </span>
                </div>
                {jobStatus.errors.length > 0 && (
                  <div className="mt-3 max-h-32 overflow-y-auto">
                    <p className="text-sm font-medium text-red-700 mb-1">
                      Errors:
                    </p>
                    {jobStatus.errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600">
                        {err}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {jobStatus &&
            (jobStatus.status === "completed" ||
              jobStatus.status === "completed_with_errors") && (
              <button
                onClick={reset}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition"
              >
                Upload Another File
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
