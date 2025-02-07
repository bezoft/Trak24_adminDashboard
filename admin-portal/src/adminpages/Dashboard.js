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
  console.log(theme);

  useEffect(() => {
    // Update isDarkMode based on the theme
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const [customerCount, setCustomerCount] = useState(0);
  const [activeUnitsCount, setActiveUnitsCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);

  const GetAnalytics = async () => {
    try {
      const response = await axios.get('/api-trkadn/get-analytics');
      if (response.statusText === "OK") {
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

  // Use the fetched data to populate customer count, active units, incidents
  useEffect(() => {
    if (Analytics.length > 0) {
      const analyticsData = Analytics[0]; // Assuming you want to work with the first entry for now

      setCustomerCount(analyticsData.totalClients);
      setActiveUnitsCount(analyticsData.activeUnits);
      setIncidentCount(analyticsData.incidents);
    }
  }, [Analytics]);

  // Function to map month names to numbers
  const monthToNumber = (monthName) => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return months.indexOf(monthName) + 1;
  };

  // Process usage data for chart
  const usageData = Analytics.length > 0 ? Analytics[0].usage : [];

  // Sort the data by month and year
  const sortedUsageData = usageData.sort((a, b) => {
    const monthA = monthToNumber(a.month);
    const monthB = monthToNumber(b.month);
    if (a.year === b.year) {
      return monthA - monthB; // Sort by month if years are the same
    }
    return a.year - b.year; // Otherwise, sort by year
  });
console.log(Analytics);

  const chartData = {
    labels: sortedUsageData.map((data) => `${data.month} ${data.year}`), // Display month and year
    datasets: [
      {
        label: "App Users",
        data: sortedUsageData.map((data) => data.appUsers),
        backgroundColor: "#4caf50",
        borderColor: "#4caf50",
      },
      {
        label: "Web Users",
        data: sortedUsageData.map((data) => data.webUsers),
        backgroundColor: "#f44336",
        borderColor: "#f44336",
      },
    ],
  };

  return (
    <>
      <div className="flex mt-24 flex-col md:flex-row w-full md:space-x-5 items-start justify-center">
        {/* Left Section */}
        <div className="space-y-5">
          <div className="border border-gray-200 dark:border-gray-700 p-6 flex flex-col space-y-6 rounded-lg">
            <div className="flex flex-col md:flex-row w-full space-x-28 items-center justify-center">
              <div className="flex flex-col items-center">
                <h1 className="block text-3xl text-gray-700 dark:text-gray-300">{customerCount}</h1>
                <h1 className="block text-md font-medium text-gray-700 dark:text-gray-300">Customers</h1>
              </div>

              <hr className="hidden md:block h-10 border-l border-gray-300 dark:border-gray-600" />

              <div className="flex flex-col items-center">
                <h1 className="block text-3xl text-gray-700 dark:text-gray-300">{activeUnitsCount}</h1>
                <h1 className="block text-md font-medium text-gray-700 dark:text-gray-300">Active Units</h1>
              </div>

              <hr className="hidden md:block h-10 border-l border-gray-300 dark:border-gray-600" />

              <div className="flex flex-col items-center">
                <h1 className="block text-3xl text-gray-700 dark:text-gray-300">{incidentCount}</h1>
                <h1 className="block text-md font-medium text-gray-700 dark:text-gray-300">Incidents</h1>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 p-6 flex flex-col space-y-6 rounded-lg">
            <div className="h-[400px] w-[900px]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  elements: {
                    line: { tension: 0.3 },
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: "Monthly App and Web Users",
                      font: { size: 18 },
                      color: isDarkMode ? "#ffffff" : "#000000", // Dynamic title color
                    },
                    legend: {
                      labels: {
                        color: isDarkMode ? "#ffffff" : "#000000", // Dynamic legend color
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: isDarkMode ? "#ffffff" : "#000000", // Dynamic x-axis tick color
                      },
                      grid: {
                        color: isDarkMode ? "#23272f" : "#FFFFFF", // Dynamic x-axis grid color
                      },
                    },
                    y: {
                      ticks: {
                        color: isDarkMode ? "#ffffff" : "#000000", // Dynamic y-axis tick color
                      },
                      grid: {
                        color: isDarkMode ? "#30343d" : "#e0e0e0", // Dynamic y-axis grid color
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-5 min-w-80">
          {/* Right Section (Summary) */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6 w-full md:max-w-96">
            <ProgressBarChart total={Analytics[0]?.totalUnits-Analytics[0]?.stockUnits} active={ Analytics[0]?.stockUnits} label={"Stock Listed Units"} isDarkMode={isDarkMode} />
            <ProgressBarChart total={Analytics[0]?.totalRfids} active={ Analytics[0]?.ActiveRfids}  label={"Active RFIDs"} isDarkMode={isDarkMode} />
            <ProgressBarChart total={Analytics[0]?.totalUnits-Analytics[0]?.stockUnits} active={ Analytics[0]?.stockUnits}  label={"Active Beacons"} isDarkMode={isDarkMode} />
            <ProgressBarChart total={Analytics[0]?.totalUnits} active={ Analytics[0]?.expiredUnits}  label={"Service Expired Units"} isDarkMode={isDarkMode} />
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6  w-full md:max-w-96">
            <h1 className="text-gray-900 dark:text-gray-300 font-semibold text-lg">Quick Links</h1>
            <div className="space-y-5">
              <a href="/eagle-eye-monitoring" className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition duration-200 ease-in-out">Eagle Eye ↗</a>
              <a href="/manage-incidents" className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition duration-200 ease-in-out">Incidents ↗</a>
              <a href="/customer-info" className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition duration-200 ease-in-out">All Customers ↗</a>
              <a href="/stock-list" className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition duration-200 ease-in-out">Stock List ↗</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
