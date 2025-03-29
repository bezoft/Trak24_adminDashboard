import React, { useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTheme } from "../contexts/ThemeContext";
import ProgressBarChart from "../Components/progchart";
import axios from "axios";

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

function Dashboard() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [Analytics, setAnalytics] = useState([]);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const [customerCount, setCustomerCount] = useState(0);
  const [activeUnitsCount, setActiveUnitsCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);

  const GetAnalytics = async () => {
    try {
      const response = await axios.get('/api-trkadn/get-analytics');
      if (response.status === 200) {
        console.log(response.data.data);
        setAnalytics(response.data.data);
      }
    } catch (error) {
      alert('Error creating user: ' + error.response.data.message);
    }
  };

  useEffect(() => {
    GetAnalytics();
  }, []);

  useEffect(() => {
    if (Analytics.length > 0) {
      const analyticsData = Analytics[0];
      setCustomerCount(analyticsData.totalClients);
      setActiveUnitsCount(analyticsData.activeUnits);
      setIncidentCount(analyticsData.incidents);
    }
  }, [Analytics]);

  const monthToNumber = (monthName) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months.indexOf(monthName) + 1;
  };

  const usageData = Analytics.length > 0 ? Analytics[0].usage : [];

  const sortedUsageData = usageData.sort((a, b) => {
    const monthA = monthToNumber(a.month);
    const monthB = monthToNumber(b.month);
    if (a.year === b.year) {
      return monthA - monthB;
    }
    return a.year - b.year;
  });

  const chartData = {
    labels: sortedUsageData.map((data) => `${data.month} ${data.year}`),
    datasets: [
      {
        label: "App Users",
        data: sortedUsageData.map((data) => data.appUsers),
        backgroundColor: "#0cb800",
        borderColor: "#0cb800",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#0cb800",
      },
      {
        label: "Web Users",
        data: sortedUsageData.map((data) => data.webUsers),
        backgroundColor: "#b84000",
        borderColor: "#b84000",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#b84000",
      },
    ],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto mt-16">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode
          ? "bg-[#1b1b1d] shadow-[5px_5px_10px_#151517,-5px_-5px_10px_#212123]"
          : "bg-[#FFFFFF] shadow-[5px_5px_10px_#d1d1d4,-5px_-5px_10px_#ffffff]"
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Customers
              </h3>
              <p className={`text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {customerCount}
              </p>
            </div>
            <div className={`p-4 rounded-full ${isDarkMode
              ? "bg-[#1d2030] shadow-[inset_3px_3px_6px_#16192a,inset_-3px_-3px_6px_#242736]"
              : "bg-[#e6e7f0] shadow-[inset_3px_3px_6px_#c3c4cc,inset_-3px_-3px_6px_#ffffff]"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode
            ? "bg-[#1b1b1d] shadow-[5px_5px_10px_#151517,-5px_-5px_10px_#212123]"
            : "bg-[#FFFFFF] shadow-[5px_5px_10px_#d1d1d4,-5px_-5px_10px_#ffffff]"
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Units</h3>
              <p className={`text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activeUnitsCount}</p>
            </div>
            <div className={`p-4 rounded-full ${isDarkMode
                ? "bg-[#1d2923] shadow-[inset_3px_3px_6px_#17211c,inset_-3px_-3px_6px_#23312a]"
                : "bg-[#e6f0ea] shadow-[inset_3px_3px_6px_#c3ccc6,inset_-3px_-3px_6px_#ffffff]"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Incidents Card */}
        <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode
            ? "bg-[#1b1b1d] shadow-[5px_5px_10px_#151517,-5px_-5px_10px_#212123]"
            : "bg-[#FFFFFF] shadow-[5px_5px_10px_#d1d1d4,-5px_-5px_10px_#ffffff]"
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Incidents</h3>
              <p className={`text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{incidentCount}</p>
            </div>
            <div className={`p-4 rounded-full ${isDarkMode
                ? "bg-[#291d1d] shadow-[inset_3px_3px_6px_#211717,inset_-3px_-3px_6px_#312323]"
                : "bg-[#f0e6e6] shadow-[inset_3px_3px_6px_#ccc3c3,inset_-3px_-3px_6px_#ffffff]"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Chart */}
        <div className={`p-6 w-5/6 rounded-xl transition-all duration-300 ${isDarkMode
          ? "bg-[#1b1b1d] shadow-[5px_5px_10px_#151517,-5px_-5px_10px_#212123]"
          : "bg-[#FFFFFF] shadow-[5px_5px_10px_#d1d1d4,-5px_-5px_10px_#ffffff]"
          }`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Usage Analytics</h2>
          <div className="h-80">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                      boxWidth: 12,
                      usePointStyle: true,
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                    },
                    ticks: {
                      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Progress Section */}
          <div className={`p-6 rounded-xl transition-all duration-300 ${isDarkMode
          ? "bg-[#1b1b1d] shadow-[5px_5px_10px_#151517,-5px_-5px_10px_#212123]"
          : "bg-[#FFFFFF] shadow-[5px_5px_10px_#d1d1d4,-5px_-5px_10px_#ffffff]"
          }`}>
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Resource Status</h2>
            <div className="space-y-6">
              <ProgressBarChart
                total={Analytics[0]?.totalUnits - Analytics[0]?.stockUnits}
                active={Analytics[0]?.stockUnits}
                label={"Stock Listed Units"}
                isDarkMode={isDarkMode}
              />
              <ProgressBarChart
                total={Analytics[0]?.totalRfids}
                active={Analytics[0]?.ActiveRfids}
                label={"Active RFIDs"}
                isDarkMode={isDarkMode}
              />
              <ProgressBarChart
                total={Analytics[0]?.totalUnits - Analytics[0]?.stockUnits}
                active={Analytics[0]?.stockUnits}
                label={"Active Beacons"}
                isDarkMode={isDarkMode}
              />
              <ProgressBarChart
                total={Analytics[0]?.totalUnits}
                active={Analytics[0]?.expiredUnits}
                label={"Service Expired Units"}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Quick Links */}
          {/* <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quick Links</h2>
            <div className="grid grid-cols-1 gap-3">
              <a href="/eagle-eye-monitoring" className={`flex items-center justify-between p-3 rounded-lg transition duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-300' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}>
                <span>Eagle Eye</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a href="/manage-incidents" className={`flex items-center justify-between p-3 rounded-lg transition duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-300' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}>
                <span>Incidents</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a href="/customer-info" className={`flex items-center justify-between p-3 rounded-lg transition duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-300' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}>
                <span>All Customers</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a href="/stock-list" className={`flex items-center justify-between p-3 rounded-lg transition duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-300' : 'bg-gray-50 hover:bg-gray-100 text-blue-600'}`}>
                <span>Stock List</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
