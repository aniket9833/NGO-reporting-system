import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Calendar, DollarSign, Loader } from "lucide-react";
import backend from "../services/backend";

const Dashboard = ({ refreshTrigger }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [selectedMonth, refreshTrigger]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const result = await backend.getDashboard(selectedMonth);
      setData(result);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Month
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {selectedMonth && (
          <button
            onClick={() => setSelectedMonth("")}
            className="ml-2 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total NGOs</h3>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {data.totalNGOs || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Reporting organizations
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                People Helped
              </h3>
              <Users className="text-green-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {(data.totalPeopleHelped || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total beneficiaries</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Events Conducted
              </h3>
              <Calendar className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {(data.totalEventsConducted || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total activities</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Funds Utilized
              </h3>
              <DollarSign className="text-amber-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${(data.totalFundsUtilized || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total spending</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
