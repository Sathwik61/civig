import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function ProjectPlayground({ darkMode, toggleDarkMode,setActiveSection }) {
    // const navigate = useNavigate(); // Use the hook to get the navigate function
    const navigateback = () => {
        setActiveSection("projects");
    };

    return (
        <div
            className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-md`}
        >
           

            {/* Button to toggle dark mode */}
            <button
                onClick={toggleDarkMode} // Toggle dark mode
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Toggle Dark Mode
            </button>

            {/* Button to navigate back */}
            <div>
                <button
                    onClick={navigateback} // Go back in history
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
            
        </div>
    );
}

export default ProjectPlayground;

