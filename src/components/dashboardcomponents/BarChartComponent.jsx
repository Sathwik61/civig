import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartComponent = ({ data, darkMode }) => {
  return (
    <div className={`p-4 md:p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
      <h2 className="text-xl font-bold mb-4">Revenue Analysis</h2>
      <div className="w-full h-[300px] md:h-[400px]">
        <Bar data={data} options={{ maintainAspectRatio: false, color: darkMode ? "#fff" : "#000" }} />
      </div>
    </div>
  );
};

export default BarChartComponent;
