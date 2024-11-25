import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import ExcellFeature from "./feature/ExcellFeature";

const ProjectPlayground = ({ darkMode }) => {
  
  const ApiUrl="https://civigo-b.onrender.com/api/auth";
  const [activeCategory, setActiveCategory] = useState(null);
  const [Categories, setCategories] = useState([]);
  const [dimensions, setDimensions] = useState({});

  const currentProjectID = localStorage.getItem("pid");

  const fetchProjectData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${ApiUrl}/projectdetails/${currentProjectID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedData = response.data;
      const transformedCategories = Object.entries(fetchedData).map(
        ([categoryName, subworks], index) => ({
          id: index + 1,
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          subworks: Object.entries(subworks).map(([subworkName, subworkData]) => ({
            name: subworkName,
            ...subworkData,
          })),
        })
      );

      setCategories(transformedCategories);

      const initialDimensions = {};
      transformedCategories.forEach((category) => {
        category.subworks.forEach((subwork) => {
          initialDimensions[`${category.id}-${subwork.name}`] = {
            length: subwork.length || 0,
            breadth: subwork.breadth || 0,
            depth: subwork.depth || 0,
            totalvalue: subwork.totalvalue || 0,
          };
        });
      });

      setDimensions(initialDimensions);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleInputChange = (categoryId, subworkName, field, value) => {
    setDimensions((prev) => ({
      ...prev,
      [`${categoryId}-${subworkName}`]: {
        ...prev[`${categoryId}-${subworkName}`],
        [field]: value,
      },
    }));
  };

  const calculateCost = (categoryId, subwork) => {
    const dims = dimensions[`${categoryId}-${subwork.name}`] || {};
    const { length = 0, breadth = 0, depth = 0 } = dims;

    if (!length || !breadth) return 0;

    if (depth) {
      const volume = length * breadth * depth;
      return volume * dims.totalvalue;
    } else {
      const area = length * breadth;
      return area * dims.totalvalue;
    }
  };

  const saveDetails = async () => {
    const groupedData = Object.entries(dimensions).reduce((acc, [key, values]) => {
      const [categoryId, subworkName] = key.split("-");
      if (!acc.foundation) {
        acc.foundation = {};
      }
      acc.foundation[subworkName] = { ...values };
      return acc;
    }, {});

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${ApiUrl}/project/saveSubworks/${currentProjectID}`,
        { groupedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Details saved successfully!");
    } catch (error) {
      console.error("Error saving details:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Bill Details", 10, 10);

    Categories.forEach((category, categoryIndex) => {
      doc.setFontSize(14);
      doc.text(`${category.name}`, 10, 20 + categoryIndex * 10);
      category.subworks.forEach((subwork, subworkIndex) => {
        const dims = dimensions[`${category.id}-${subwork.name}`];
        const estimatedCost = calculateCost(category.id, subwork).toFixed(2);
        doc.setFontSize(12);
        doc.text(
          `${subwork.name}: Length: ${dims?.length || 0} ft, Breadth: ${dims?.breadth || 0} ft, Depth: ${dims?.depth || 0} ft, Cost: ₹${estimatedCost}`,
          10,
          30 + (categoryIndex + subworkIndex) * 10
        );
      });
    });

    doc.save("BillDetails.pdf");
  };

  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:gap-4 ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-4 sm:p-2`}
    >
      {Categories.map((category) => (
        <div
          key={category.id}
          className={`rounded-lg shadow-lg border-2 ${darkMode ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-300 bg-white"}`}
        >
          <div
            className={`p-3 flex items-center justify-between cursor-pointer rounded-t-lg ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gradient-to-r from-blue-500 to-teal-400 text-white"}`}
            onClick={() =>
              setActiveCategory(activeCategory === category.id ? null : category.id)
            }
          >
            <h2 className="font-bold text-lg">{category.name}</h2>
          </div>

          {activeCategory === category.id && (
            <div className="p-4 space-y-4">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={downloadPDF}
                  className={`py-1 px-3 rounded-md text-sm ${darkMode ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gradient-to-r from-blue-400 to-green-400 text-white"}`}
                >
                  Download Bill as PDF
                </button>
                <ExcellFeature
                  Categories={Categories}
                  dimensions={dimensions}
                  calculateCost={calculateCost}
                />
              </div>
              {category.subworks.map((subwork, index) => (
                <div key={index} className="mb-4 border-b pb-3">
                  <h3 className="font-semibold text-base mb-2 text-blue-600">{subwork.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {["Length (ft)", "Breadth (ft)", "Depth (ft)", "Cost per Cft/Sqft"].map((label, i) => {
                      const fields = ["length", "breadth", "depth", "totalvalue"];
                      return (
                        <div className="flex items-center" key={i}>
                          <span className={`w-1/3 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {label} {fields[i] === "totalvalue" && "(₹)"}:
                          </span>
                          <input
                            type="number"
                            placeholder={label}
                            className={`flex-grow px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 text-gray-200 border-gray-600 placeholder-gray-400 focus:ring-teal-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-blue-500"}`}
                            value={dimensions[`${category.id}-${subwork.name}`]?.[fields[i]] || ""}
                            onChange={(e) =>
                              handleInputChange(
                                category.id,
                                subwork.name,
                                fields[i],
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                      );
                    })}
                    <div className={`mt-2 text-base font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                      Estimated Cost: ₹{calculateCost(category.id, subwork).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={saveDetails}
                className={`w-full py-2 rounded-lg text-sm font-medium ${darkMode ? "bg-purple-600 text-gray-200" : "bg-blue-500 text-white"} hover:opacity-80`}
              >
                Save
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectPlayground;
