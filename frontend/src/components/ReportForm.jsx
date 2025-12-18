import React, { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import backend from "../services/backend";

const ReportForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const report = {
        ngoId: formData.ngoId,
        month: formData.month,
        peopleHelped: parseInt(formData.peopleHelped),
        eventsConducted: parseInt(formData.eventsConducted),
        fundsUtilized: parseFloat(formData.fundsUtilized),
      };

      await backend.submitReport(report);
      setSuccess("Report submitted successfully!");
      setFormData({
        ngoId: "",
        month: "",
        peopleHelped: "",
        eventsConducted: "",
        fundsUtilized: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Submit Monthly Report
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="text-green-600 mt-0.5" size={20} />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NGO ID *
          </label>
          <input
            type="text"
            required
            value={formData.ngoId}
            onChange={(e) =>
              setFormData({ ...formData, ngoId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., NGO001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month *
          </label>
          <input
            type="month"
            required
            value={formData.month}
            onChange={(e) =>
              setFormData({ ...formData, month: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            People Helped *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.peopleHelped}
            onChange={(e) =>
              setFormData({ ...formData, peopleHelped: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Events Conducted *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.eventsConducted}
            onChange={(e) =>
              setFormData({ ...formData, eventsConducted: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funds Utilized ($) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.fundsUtilized}
            onChange={(e) =>
              setFormData({ ...formData, fundsUtilized: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Submitting...
            </>
          ) : (
            "Submit Report"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
