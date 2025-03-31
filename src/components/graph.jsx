import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch API data (Replace with your API)
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((apiData) => {
        // Example of transforming API response
        const formattedData = [
          { date: "Feb 01", total: 648, positive: 256, neutral: 338, negative: 54 },
          { date: "Feb 02", total: 500, positive: 200, neutral: 250, negative: 50 },
          { date: "Feb 03", total: 300, positive: 150, neutral: 120, negative: 30 },
          { date: "Feb 04", total: 100, positive: 50, neutral: 40, negative: 10 },
          { date: "Feb 05", total: 700, positive: 350, neutral: 300, negative: 50 },
          { date: "Feb 06", total: 600, positive: 280, neutral: 260, negative: 60 },
          { date: "Feb 07", total: 500, positive: 250, neutral: 230, negative: 40 },
        ];
        setData(formattedData);
      });
  }, []);

  return (
    <div style={{ background: "#121212", padding: "20px", color: "#fff" }}>
      <h2>Contact Sentiment Overview</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#89f7fe" dot={{ r: 4 }} name="Total Calls" />
          <Line type="monotone" dataKey="positive" stroke="#00ff00" dot={{ r: 4 }} name="Positive" />
          <Line type="monotone" dataKey="neutral" stroke="#ffcc00" dot={{ r: 4 }} name="Neutral" />
          <Line type="monotone" dataKey="negative" stroke="#ff0000" dot={{ r: 4 }} name="Negative" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
