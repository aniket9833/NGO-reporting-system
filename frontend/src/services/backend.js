/**
 * Backend API Service
 * Handles all API calls to the Express backend server
 * Falls back to mock data if backend is unavailable
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Mock data for development/fallback
const mockDashboardData = {
  totalNGOs: 5,
  totalPeopleHelped: 1250,
  totalEventsConducted: 42,
  totalFundsUtilized: 125000,
};

const mockJobStatuses = new Map();

/**
 * Helper function to handle API requests
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

/**
 * Backend API methods
 */
const backend = {
  submitReport: async (report) => {
    if (USE_MOCK_DATA) {
      console.log("Mock: Report submitted", report);
      return { success: true, message: "Report submitted successfully" };
    }
    return apiCall("/report", {
      method: "POST",
      body: JSON.stringify(report),
    });
  },

  uploadCSV: async (file) => {
    if (USE_MOCK_DATA) {
      const jobId = "mock-job-" + Date.now();
      mockJobStatuses.set(jobId, {
        status: "completed",
        processed: 2,
        total: 2,
        successful: 2,
        failed: 0,
        errors: [],
      });
      console.log("Mock: CSV uploaded with jobId", jobId);
      return { jobId };
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/reports/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || `Upload Error: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  },

  getJobStatus: async (jobId) => {
    if (USE_MOCK_DATA) {
      const status = mockJobStatuses.get(jobId) || {
        status: "completed",
        processed: 2,
        total: 2,
        successful: 2,
        failed: 0,
        errors: [],
      };
      console.log("Mock: Job status retrieved", status);
      return status;
    }
    const response = await apiCall(`/job-status/${jobId}`);
    return response.data;
  },

  getDashboard: async (month = "") => {
    if (USE_MOCK_DATA) {
      console.log("Mock: Dashboard data retrieved");
      return mockDashboardData;
    }
    const query = month ? `?month=${month}` : "";
    const response = await apiCall(`/dashboard${query}`);
    return response.data;
  },
};

export default backend;
