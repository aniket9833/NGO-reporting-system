/**
 * Backend API Service
 * Handles all API calls to the Express backend server
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    return apiCall("/reports/submit", {
      method: "POST",
      body: JSON.stringify(report),
    });
  },

  uploadCSV: async (file) => {
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
    return apiCall(`/reports/job-status/${jobId}`);
  },

  getDashboard: async (month = "") => {
    const query = month ? `?month=${month}` : "";
    return apiCall(`/dashboard${query}`);
  },
};

export default backend;
