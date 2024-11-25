import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const LoginPage = ({ setToken }) => {
  const ApiUrl="https://civigo-b.onrender.com/api/auth";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${ApiUrl}/login`, { email, password });
      const { user ,token} = response.data;
      // console.log('Logged in as', user,"\n",token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken('authenticated');
      window.location.reload(); 
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.email) {
        navigate('/dashboard');
      } else {
        // If no valid user data is found, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">Login</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white dark:text-gray-900 bg-black dark:bg-white rounded-md transition-colors ${isLoading ? 'opacity-75' : 'hover:bg-gray-800 dark:hover:bg-gray-200'} focus:outline-none`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
