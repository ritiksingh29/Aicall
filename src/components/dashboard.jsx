import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./styles.css";

const CALL_LOGS_API = "http://102.140.119.59:5003/call-logs";
const TOP_USAGE_DAYS_API = "http://102.140.119.59:5003/top-usage-days";
const PHONE_NUMBERS = ["+15037483026", "+27872502149", "+27872502261"];

const Dashboard = () => {
  const [selectedNumber, setSelectedNumber] = useState(PHONE_NUMBERS[0]);
  const [callLogs, setCallLogs] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCallLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${CALL_LOGS_API}?twilio_number=${encodeURIComponent(selectedNumber)}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setCallLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchGraphData = async () => {
      try {
        const response = await fetch(
          `${TOP_USAGE_DAYS_API}?twilio_number=${encodeURIComponent(
            selectedNumber
          )}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setGraphData(
          data.map((entry) => ({
            date: entry.date,
            calls: entry.call_count,
          }))
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCallLogs();
    fetchGraphData();
  }, [selectedNumber]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Call Logs Dashboard</h2>
      <div className="number-selection">
        {PHONE_NUMBERS.map((number) => (
          <button
            key={number}
            className={selectedNumber === number ? "selected" : ""}
            onClick={() => setSelectedNumber(number)}
          >
            {number}
          </button>
        ))}
      </div>

      <div className="graph-container">
        {graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No graph data available.</p>
        )}
      </div>

      {loading ? (
        <p className="dashboard-message">Loading call logs...</p>
      ) : error ? (
        <p className="dashboard-message">Error: {error}</p>
      ) : (
        <div className="table-container">
          <table className="call-logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Direction</th>
                <th>From</th>
                <th>To</th>
                <th>Duration (sec)</th>
              </tr>
            </thead>
            <tbody>
              {callLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.date}</td>
                  <td className={log.direction === "inbound" ? "inbound" : ""}>
                    {log.direction}
                  </td>
                  <td>{log.from_number}</td>
                  <td>{log.to_number}</td>
                  <td>{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
