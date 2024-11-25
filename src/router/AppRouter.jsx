import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import ProjectPage from '../components/dashboardcomponents/project/ProjectPage';
import ProjectPlayground from '../components/dashboardcomponents/project/ProjectPlayground';

const AppRouter = ({ toggleDarkMode, darkMode }) => {
  const [token, setToken] = useState(null);
  return (
    <Router>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
        {/* <Route path="/dashboard/all" element={<ProjectPage toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} /> */}
        <Route path="/project" element={<ProjectPlayground toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
