import React, { useState } from "react";
import { FiMenu, FiPieChart, FiFileText, FiUser, FiLogOut, FiFolder, FiSun, FiMoon } from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { useNavigate } from 'react-router-dom';

import FormComponent from "./dashboardcomponents/FormComponent";
import LineChartComponent from "./dashboardcomponents/LineChartComponent";
import BarChartComponent from "./dashboardcomponents/BarChartComponent";
import ProfileComponent from "./dashboardcomponents/ProfileComponent";
import ProjectPage from "./dashboardcomponents/project/ProjectPage";
import ProjectPlayground from "./dashboardcomponents/project/ProjectPlayground";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ toggleDarkMode, darkMode }) => {

  const ApiUrl="https://civigo-b.onrender.com/api/auth";
const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");
  // const [darkMode, setDarkMode] = useState();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  });

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: darkMode ? "rgb(147, 197, 253)" : "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Revenue",
        data: [12, 19, 3, 5, 2],
        backgroundColor: darkMode ? "rgba(147, 197, 253, 0.5)" : "rgba(153, 102, 255, 0.5)"
      }
    ]
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  const handleLogout = () => {
   if (window.confirm("Are you sure you want to logout?")) {
      //Cookies.remove('user');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('pid');
      navigate('/login');
      console.log("Logging out...");
  }
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        {/* <button
          onClick={() => toggleDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {darkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
        </button> */}
      </div>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 ${darkMode ? "bg-gray-800" : "bg-white"} 
        fixed md:relative z-30 w-64 h-full transition-transform duration-300 ease-in-out 
        p-4 shadow-lg overflow-y-auto`}
      >
        <div className="hidden md:flex justify-between items-center mb-8">
          {/* <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button> */}
          {/* <button
            onClick={() => toggleDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
          </button> */}
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => {
              setActiveSection("analytics");
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-lg ${activeSection === "analytics" ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            aria-label="Analytics"
          >
            <FiPieChart className="w-6 h-6" />
            <span className="ml-3">Analytics</span>
          </button>

          <button
            onClick={() => {
              setActiveSection("form");
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-lg ${activeSection === "form" ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            aria-label="Form"
          >
            <FiFileText className="w-6 h-6" />
            <span className="ml-3">Default</span>
          </button>
          <button
            onClick={() => {
              setActiveSection("projects");
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-lg ${activeSection === "projects"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            aria-label="Projects"
          >
            <FiFolder className="w-6 h-6" />
            <span className="ml-3">Projects</span>
          </button>


          <button
            onClick={() => {
              setActiveSection("profile");
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-lg ${activeSection === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            aria-label="Profile"
          >
            <FiUser className="w-6 h-6" />
            <span className="ml-3">Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            aria-label="Logout"
          >
            <FiLogOut className="w-6 h-6" />
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto mt-14 md:mt-0">
        {activeSection === "analytics" && (
          <div className="grid gap-8 md:grid-cols-2">
            <LineChartComponent data={chartData} darkMode={darkMode} />
            <BarChartComponent data={barData} darkMode={darkMode} />
          </div>
        )}
        <div>
          {activeSection === "form" && (
            <FormComponent
              darkMode={darkMode}
              formData={formData}
              setFormData={setFormData}
              handleFormSubmit={handleFormSubmit}
            />
          )}
        </div>

        {activeSection === "projects" && (
          <ProjectPage
            darkMode={darkMode}
            formData={formData}
            setActiveSection={setActiveSection}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
          />
        )}
        {activeSection === "profile" && (
          <ProfileComponent
            darkMode={darkMode}
            profileData={profileData}
            setProfileData={setProfileData}
            handleProfileUpdate={handleProfileUpdate}
          />
        )}

        {activeSection === "playground" && (
          <ProjectPlayground
            darkMode={darkMode} toggleDarkMode={toggleDarkMode} setActiveSection={setActiveSection}
            
          />
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;