import React, { useState } from "react";
import Sidebar from "./SideBar";
import "./css/ReportGeneration.css"; // Import the CSS file

const ReportGeneration = () => {
  const [reportType, setReportType] = useState("monthly"); // State for report type (monthly, semester, or school year)
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = () => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];

    // Filter items based on report type
    const filteredItems = storedItems.filter((item) => {
      const itemDate = new Date(item.dateSurrendered || item.dateFound);
      const currentDate = new Date();

      switch (reportType) {
        case "monthly":
          return (
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear()
          );
        case "semester":
          const semesterStart = new Date(currentDate.getFullYear(), 0, 1); // January 1
          const semesterEnd = new Date(currentDate.getFullYear(), 5, 30); // June 30 (first semester)
          return itemDate >= semesterStart && itemDate <= semesterEnd;
        case "schoolYear":
          const schoolYearStart = new Date(currentDate.getFullYear(), 5, 1); // June 1 (start of school year)
          const schoolYearEnd = new Date(currentDate.getFullYear() + 1, 4, 31); // May 31 (end of school year)
          return itemDate >= schoolYearStart && itemDate <= schoolYearEnd;
        default:
          return true;
      }
    });

    // Group data by building and calculate totals
    const report = filteredItems.reduce((acc, item) => {
      const building = item.locationFound || "Unknown";
      if (!acc[building]) {
        acc[building] = { surrendered: 0, retrieved: 0 };
      }
      if (item.claimed) {
        acc[building].retrieved += 1;
      } else {
        acc[building].surrendered += 1;
      }
      return acc;
    }, {});

    // Convert the report object into an array for rendering
    const reportArray = Object.keys(report).map((building) => ({
      building,
      surrendered: report[building].surrendered,
      retrieved: report[building].retrieved,
    }));

    setReportData(reportArray);
  };

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
          <button onClick={handleGenerateReport}>Generate Report</button>
        </div>

        {reportData.length > 0 ? (
          <table className="ReportTable">
            <thead>
              <tr>
                <th>Building</th>
                <th>Items Surrendered</th>
                <th>Items Retrieved</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.building}</td>
                  <td>{item.surrendered}</td>
                  <td>{item.retrieved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available for the selected report type.</p>
        )}
      </div>
    </div>
  );
};

export default ReportGeneration;