import React, { useState } from "react";
import ReportForm from "./components/ReportForm";
import BulkUpload from "./components/BulkUpload";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function NGOReportSystem() {
  const [activeTab, setActiveTab] = useState("submit");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NGO Monthly Reports
          </h1>
          <p className="text-gray-600">
            Submit and track NGO activities and impact
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "submit"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Bulk Upload
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Admin Dashboard
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "submit" && <ReportForm onSuccess={handleSuccess} />}
          {activeTab === "upload" && <BulkUpload onSuccess={handleSuccess} />}
          {activeTab === "dashboard" && (
            <Dashboard refreshTrigger={refreshTrigger} />
          )}
        </div>
      </div>
    </div>
  );
}
