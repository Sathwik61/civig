import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectPage = ({ darkMode, setActiveSection }) => {
    
  const ApiUrl="https://civigo-b.onrender.com/api/auth";
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [clientAddress, setClientAddress] = useState(""); // New state for client address
    const [clientContact, setClientContact] = useState(""); // New state for client contact
    const [projects, setProjects] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch projects from the backend
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${ApiUrl}/project`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleAddProject = async (e) => {
        e.preventDefault();

        if (projectName && projectDescription) {
            // Default client address and client contact to "N/A" if not provided
            const newProject = {
                projectname: projectName,
                description: projectDescription,
                clientname: projectName, // Assuming project name as client name for now
                clientaddress: clientAddress || "N/A", // Use "N/A" if client address is empty
                clientcontact: clientContact || "N/A", // Use "N/A" if client contact is empty
            };

            try {
                if (editingIndex !== null) {
                    // Edit the project if in edit mode
                    const updatedProject = { ...newProject, _id: projects[editingIndex]._id };
                    const response = await axios.put(
                        `${ApiUrl}/project/${updatedProject._id}`,
                        updatedProject,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );

                    // Update the projects list with the updated project
                    const updatedProjects = [...projects];
                    updatedProjects[editingIndex] = response.data;
                    setProjects(updatedProjects);
                    setEditingIndex(null); // Reset editing index after update
                } else {
                    console.log(newProject)
                    // Add a new project if not in edit mode
                    const response = await axios.post(
                        `${ApiUrl}/project`,
                        newProject,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );

                    setProjects([...projects, response.data]);
                }

                // Reset form fields
                setProjectName("");
                setProjectDescription("");
                setClientAddress("");
                setClientContact("");
                setIsModalOpen(false); // Close the modal after submission
            } catch (error) {
                console.error("Error handling project:", error);
            }
        } else {
            alert("Please fill in both the project name and description");
        }
    };

    const handleEditProject = async(projectId) => {
        

        // Find the project to be edited by its ID
        const projectToEdit = projects.find(project => project._id === projectId);
        setProjectName(projectToEdit.projectname);
        setProjectDescription(projectToEdit.description);
        setClientAddress(projectToEdit.clientaddress);
        setClientContact(projectToEdit.clientcontact);
        setEditingIndex(projects.findIndex(project => project._id === projectId));
        setIsModalOpen(true); // Open the modal for editing
    };

    const handleDeleteProject = async (projectId) => {
    try {
        // Send the DELETE request using POST, passing projectId in the body
        const response = await axios.post(
            `${ApiUrl}/project/delete`,
            { projectId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        // Handle successful deletion
        if (response.status === 200) {
            // Remove the deleted project from the list
            setProjects(projects.filter(project => project._id !== projectId));
        } else {
            console.error('Error deleting project:', response.data.message);
        }
    } catch (error) {
        console.error("Error deleting project:", error);
    }
};


    const handleOpen = (projectId) => {
        setActiveSection("playground");
        localStorage.setItem("pid", projectId);
    };

    return (
        <div className={`p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg shadow-md`}>
            <h2 className="text-2xl font-bold mb-4 sm:text-xl">Projects</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <button onClick={() => setIsModalOpen(true)} className="mb-4 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 sm:mb-0 sm:w-auto sm:text-sm">
                    New Project
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 sm:text-md">Project List</h3>
                <ul className="space-y-3">
                    {projects.map((project) => (
                        <li key={project._id} className={`p-3 border rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex flex-col sm:flex-row sm:justify-between sm:items-center sm:space-x-4`}>
                            <div>
                                <h4 className="font-bold text-md sm:text-sm">{project.projectname}</h4>
                                <p className="text-sm sm:text-xs">{project.description || "No description available"}</p>
                            </div>
                            <div className="space-x-2 sm:space-x-0 sm:w-full sm:flex sm:justify-end gap-3">
                                <button onClick={() => handleOpen(project._id)} className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 sm:w-auto lg:w-auto">Open</button>
                                <button onClick={() => handleEditProject(project._id)} className="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 sm:w-auto lg:w-auto">Edit</button>
                                <button onClick={() => handleDeleteProject(project._id)} className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 sm:w-auto lg:w-auto">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className={`p-6 ${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md w-96 sm:w-80`}>
                        <h3 className="text-xl font-semibold mb-4 sm:text-lg">{editingIndex !== null ? "Edit Project" : "New Project"}</h3>
                        <form onSubmit={handleAddProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Project Name</label>
                                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100"} sm:text-sm`} placeholder="Enter project name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Project Description</label>
                                <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100"} sm:text-sm`} placeholder="Enter project description" rows="4" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Client Address (Optional)</label>
                                <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100"} sm:text-sm`} placeholder="Enter client address" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Client Contact (Optional)</label>
                                <input type="text" value={clientContact} onChange={(e) => setClientContact(e.target.value)} className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100"} sm:text-sm`} placeholder="Enter client contact" />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">{editingIndex !== null ? "Update" : "Add"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;
