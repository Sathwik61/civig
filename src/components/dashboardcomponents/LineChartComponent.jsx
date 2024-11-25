import React from "react";
import { Line } from "react-chartjs-2";

const LineChartComponent = ({ data, darkMode }) => {
  return (
    <div className={`p-4 md:p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
      <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
      <div className="w-full h-[300px] md:h-[400px]">
        <Line data={data} options={{ maintainAspectRatio: false, color: darkMode ? "#fff" : "#000" }} />
      </div>
    </div>
  );
};

export default LineChartComponent;
