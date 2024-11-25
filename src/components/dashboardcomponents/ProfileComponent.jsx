import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileComponent = ({ darkMode }) => {
  
  const ApiUrl="https://civigo-b.onrender.com/api/auth";
  const [profileData, setProfileData] = useState({ name: "", email: "", avatar: "https://robohash.org/your-unique-id.png" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        console.log(localStorage.getItem('token'));
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${ApiUrl}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`max-w-md mx-auto p-4 md:p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <div className="mb-6 text-center">
        <img
          src="https://robohash.org/13.png"
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
        {/* <button className="text-blue-500 hover:text-blue-600">
          Change Photo
        </button> */}
      </div>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileComponent;
