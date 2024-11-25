import React, { useState, useEffect } from "react";
import { FaHardHat, FaPaintRoller, FaCalculator } from "react-icons/fa";
import axios from "axios";

const FormComponent = ({ darkMode }) => {
  const ApiUrl="https://civigo-b.onrender.com/api/auth";
  const [foundationInputs, setFoundationInputs] = useState({
    earthWork: "",
    bedConcrete: "",
    rrMasonry: "",
    ssMasonry: "",
    dpc: ""
  });

  const [paintingInputs, setPaintingInputs] = useState({
    interiorWall: "",
    exteriorWall: "",
    oilPaint: ""
  });

  const [totalCost, setTotalCost] = useState(0);
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  useEffect(() => {
    
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return; // handle token absence gracefully
    }
    
    axios.get(`${ApiUrl}/cost`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data) {
        setFoundationInputs(response.data.foundation);
        setPaintingInputs(response.data.painting);
        const updatedDate = new Date(response.data.lastUpdated);
        const formattedDate = updatedDate.toLocaleString();
        setLastUpdated(formattedDate || "Not available");
      }
    })
    .catch(err => {
      console.error('Error fetching data:', err);
    });
  }, []);

  const validateNumber = (value) => {
    return !isNaN(value) && value >= 0;
  };

  const handleFoundationChange = (e) => {
    const { name, value } = e.target;
    setFoundationInputs(prev => ({
      ...prev,
      [name]: value
    }));

    if (!validateNumber(value) && value !== "") {
      setErrors(prev => ({
        ...prev,
        [name]: "Please enter a valid number"
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePaintingChange = (e) => {
    const { name, value } = e.target;
    setPaintingInputs(prev => ({
      ...prev,
      [name]: value
    }));

    if (!validateNumber(value) && value !== "") {
      setErrors(prev => ({
        ...prev,
        [name]: "Please enter a valid number"
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const calculateTotal = () => {
    const foundationTotal = Object.values(foundationInputs).reduce(
      (acc, val) => acc + (validateNumber(val) ? parseFloat(val) : 0),
      0
    );
    const paintingTotal = Object.values(paintingInputs).reduce(
      (acc, val) => acc + (validateNumber(val) ? parseFloat(val) : 0),
      0
    );
    setTotalCost(foundationTotal + paintingTotal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      calculateTotal();
      const token = localStorage.getItem('token');
      
      if (!token) {
        setPopupMessage("Token not found. Please log in again.");
        setPopupType("error");
        return;
      }

      axios.post(`${ApiUrl}/cost`, {
        foundation: foundationInputs,
        painting: paintingInputs
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setPopupMessage("Costs updated successfully!");
        setPopupType("success");
        setLastUpdated(new Date().toLocaleString());
      }).catch(err => {
        setPopupMessage("Error updating costs. Please try again.");
        setPopupType("error");
        console.error('Error saving data:', err);
      });
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className={`max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className={`px-6 py-4 ${darkMode ? "bg-gray-700" : "bg-gradient-to-r from-blue-600 to-blue-800"}`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaHardHat /> Construction Cost Estimator
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Foundation Inputs Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <FaHardHat />
              <h3>Foundation Costs ( ₹ per cft)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                earthWork: "Earth Work",
                bedConcrete: "Bed Concrete",
                rrMasonry: "R.R. Masonry",
                ssMasonry: "S.S. Masonry",
                dpc: "D.P.C"
              }).map(([key, label]) => (
                <div key={key} className="relative">
                  <label
                    htmlFor={key}
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={foundationInputs[key]}
                    onChange={handleFoundationChange}
                    placeholder="0.00"
                    className={`mt-1 block w-full px-3 py-2 border ${errors[key] ? "border-red-500" : darkMode ? "border-gray-600" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                    aria-label={`${label} cost per cubic foot`}
                    min="0"
                    step="0.01"
                  />
                  {errors[key] && (
                    <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Painting Inputs Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <FaPaintRoller />
              <h3>Painting Costs ( ₹ per sqft)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                interiorWall: "Interior Ceiling & Wall",
                exteriorWall: "Exterior Wall and Ceiling (2 coats)",
                oilPaint: "Oil Paint - Window Sills & Doors"
              }).map(([key, label]) => (
                <div key={key} className="relative">
                  <label
                    htmlFor={key}
                    className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={paintingInputs[key]}
                    onChange={handlePaintingChange}
                    placeholder="0.00"
                    className={`mt-1 block w-full px-3 py-2 border ${errors[key] ? "border-red-500" : darkMode ? "border-gray-600" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                    aria-label={`${label} cost per square foot`}
                    min="0"
                    step="0.01"
                  />
                  {errors[key] && (
                    <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          {/* <div className="flex items-center gap-2 text-xl font-semibold">
            <FaCalculator />
            <h3>Total Cost: ₹ {totalCost.toFixed(2)}</h3>
          </div> */}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <p>Last Updated: {lastUpdated}</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FormComponent;
