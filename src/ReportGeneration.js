import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { supabase } from "./supabase"; // Adjust the path as needed
import "./css/ReportGeneration.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportGeneration = () => {
  const [reportType, setReportType] = useState("monthly");
  const [chartType, setChartType] = useState("bar");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate date ranges based on report type
  const getDateRange = () => {
    const currentDate = new Date();
    
    switch (reportType) {
      case "monthly":
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return { start: monthStart, end: monthEnd };
      
      case "semester":
        // Check which semester we're currently in
        const currentMonth = currentDate.getMonth();
        // First semester: June to October
        // Second semester: November to March
        let semesterStart, semesterEnd;
        
        if (currentMonth >= 5 && currentMonth <= 9) { // June to October
          semesterStart = new Date(currentDate.getFullYear(), 5, 1); // June 1
          semesterEnd = new Date(currentDate.getFullYear(), 10, 0); // October 31
        } else { // November to March
          if (currentMonth >= 10) { // November-December
            semesterStart = new Date(currentDate.getFullYear(), 10, 1); // November 1
            semesterEnd = new Date(currentDate.getFullYear() + 1, 3, 31); // March 31 next year
          } else { // January-March
            semesterStart = new Date(currentDate.getFullYear() - 1, 10, 1); // November 1 last year
            semesterEnd = new Date(currentDate.getFullYear(), 3, 31); // March 31
          }
        }
        return { start: semesterStart, end: semesterEnd };
      
      case "schoolYear":
        // School year typically runs from June to March of the following year
        const schoolYearStart = new Date(currentDate.getFullYear(), 5, 1); // June 1
        const schoolYearEnd = new Date(currentDate.getFullYear() + 1, 3, 31); // March 31 next year
        
        // If we're past March, we need the next school year
        if (currentDate.getMonth() > 3) {
          return { start: schoolYearStart, end: schoolYearEnd };
        } else {
          return {
            start: new Date(currentDate.getFullYear() - 1, 5, 1), // June 1 last year
            end: new Date(currentDate.getFullYear(), 3, 31), // March 31 this year
          };
        }
      
      default:
        return { start: null, end: null };
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { start, end } = getDateRange();
      
      // Format dates for Supabase query
      const startDate = start.toISOString();
      const endDate = end.toISOString();
      
      // Fetch registered_items for the date range (surrendered items)
      const { data: registeredItems, error: registeredError } = await supabase
        .from('registered_items')
        .select('*')
        .gte('datetime_found', startDate)
        .lte('datetime_found', endDate);
      
      if (registeredError) throw registeredError;
      
      // Fetch claimed_items for the date range (retrieved items)
      const { data: claimedItems, error: claimedError } = await supabase
        .from('claimed_items')
        .select('*, stored_in')
        .gte('claimed_dateTime', startDate)
        .lte('claimed_dateTime', endDate)
        .eq('claim_status', 'claimed');
      
      if (claimedError) throw claimedError;
      
      // Process and organize data by building location
      const buildingStats = {};
      
      // Process registered items (all surrendered items)
      registeredItems.forEach(item => {
        const building = item.location_found || "Unknown";
        
        if (!buildingStats[building]) {
          buildingStats[building] = { surrendered: 0, retrieved: 0 };
        }
        
        buildingStats[building].surrendered += 1;
      });
      
      // Process claimed items
      claimedItems.forEach(item => {
        const building = item.stored_in || "Unknown";
        
        if (!buildingStats[building]) {
          buildingStats[building] = { surrendered: 0, retrieved: 0 };
        }
        
        buildingStats[building].retrieved += 1;
      });
      
      // Convert to array format for display
      const formattedData = Object.keys(buildingStats).map(building => ({
        building,
        surrendered: buildingStats[building].surrendered,
        retrieved: buildingStats[building].retrieved,
      }));
      
      setReportData(formattedData);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    const labels = reportData.map(item => item.building);
    
    return {
      labels,
      datasets: [
        {
          label: 'Items Surrendered',
          data: reportData.map(item => item.surrendered),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Items Retrieved',
          data: reportData.map(item => item.retrieved),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare pie chart data for total surrendered vs retrieved
  const preparePieData = () => {
    const totalSurrendered = reportData.reduce((sum, item) => sum + item.surrendered, 0);
    const totalRetrieved = reportData.reduce((sum, item) => sum + item.retrieved, 0);
    
    return {
      labels: ['Surrendered', 'Retrieved'],
      datasets: [
        {
          data: [totalSurrendered, totalRetrieved],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Lost & Found Report (${reportType.charAt(0).toUpperCase() + reportType.slice(1)})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Total Items Surrendered vs Retrieved (${reportType.charAt(0).toUpperCase() + reportType.slice(1)})`,
      },
    },
  };

  // Get report period label based on report type
  const getReportPeriodLabel = () => {
    const currentDate = new Date();
    
    switch (reportType) {
      case "monthly":
        return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
      case "semester":
        const currentMonth = currentDate.getMonth();
        if (currentMonth >= 5 && currentMonth <= 9) {
          return `First Semester ${currentDate.getFullYear()}`;
        } else {
          return `Second Semester ${currentMonth <= 3 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()}-${currentMonth <= 3 ? currentDate.getFullYear() : currentDate.getFullYear() + 1}`;
        }
      case "schoolYear":
        return `School Year ${currentDate.getMonth() > 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1}-${currentDate.getMonth() > 3 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}`;
      default:
        return "";
    }
  };

  // Calculate totals
  const totalSurrendered = reportData.reduce((sum, item) => sum + item.surrendered, 0);
  const totalRetrieved = reportData.reduce((sum, item) => sum + item.retrieved, 0);
  const totalItems = totalSurrendered + totalRetrieved;
  const retrievalRate = totalSurrendered > 0 ? ((totalRetrieved / totalSurrendered) * 100).toFixed(2) : 0;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ReportGenerationContent">
        <h1>Report Generation</h1>
        
        <div className="ReportFilters">
          <div className="FilterGroup">
            <label>Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="semester">Semester</option>
              <option value="schoolYear">School Year</option>
            </select>
          </div>
          
          <div className="FilterGroup">
            <label>Chart Type:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          
          <button 
            onClick={handleGenerateReport} 
            disabled={loading}
            className="GenerateButton"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {error && <div className="ErrorMessage">{error}</div>}

        {reportData.length > 0 && (
          <div className="ReportContainer">
            <h2 className="ReportTitle">
              {getReportPeriodLabel()}
            </h2>
            
            <div className="StatsSummary">
              <div className="StatCard">
                <h3>Total Items</h3>
                <div className="StatValue">{totalItems}</div>
              </div>
              <div className="StatCard">
                <h3>Items Surrendered</h3>
                <div className="StatValue">{totalSurrendered}</div>
              </div>
              <div className="StatCard">
                <h3>Items Retrieved</h3>
                <div className="StatValue">{totalRetrieved}</div>
              </div>
              <div className="StatCard">
                <h3>Retrieval Rate</h3>
                <div className="StatValue">{retrievalRate}%</div>
              </div>
            </div>

            <div className="ChartContainer">
              {chartType === 'bar' ? (
                <Bar data={prepareChartData()} options={chartOptions} />
              ) : (
                <Pie data={preparePieData()} options={pieOptions} />
              )}
            </div>

            <div className="TableContainer">
              <h3>Detailed Report by Building</h3>
              <table className="ReportTable">
                <thead>
                  <tr>
                    <th>Building</th>
                    <th>Items Surrendered</th>
                    <th>Items Retrieved</th>
                    <th>Retrieval Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.building}</td>
                      <td>{item.surrendered}</td>
                      <td>{item.retrieved}</td>
                      <td>
                        {item.surrendered > 0 
                          ? `${((item.retrieved / item.surrendered) * 100).toFixed(2)}%` 
                          : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportData.length === 0 && !loading && (
          <p className="NoDataMessage">No data available for the selected report type. Generate a report to see data.</p>
        )}
      </div>
    </div>
  );
};

export default ReportGeneration;