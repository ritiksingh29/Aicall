import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = "http://102.140.119.59:5003/call-logs";
const TWILIO_NUMBER = "+15037483026"; // Change this based on the required number

const CallLogs = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const response = await fetch(`${API_URL}?twilio_number=${encodeURIComponent(TWILIO_NUMBER)}`);
        const data = await response.json();

        // Processing data for the chart
        const formattedData = data.map((call, index) => ({
          name: call.date, // X-axis: Date of the call
          duration: parseInt(call.duration, 10), // Y-axis: Call duration
        }));

        setCallLogs(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching call logs:", error);
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, []);

  return (
    <div>
      <h2>Call Logs Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={callLogs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "Duration (sec)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="duration" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CallLogs;
