// axiosInstance.js

import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://manage.trak24.in/api/", // Replace with your actual API base URL
  timeout: 10000, // Optional: Set a timeout for requests
});

// Add a request interceptor to attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Fetch the token from localStorage
    console.log(token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token in Authorization header
    }
    
    return config; // Return the config object to continue with the request
  },
  (error) => {
    return Promise.reject(error); // Handle any errors (optional)
  }
);

export default axiosInstance; // Export the configured axios instance
