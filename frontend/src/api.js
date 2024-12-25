import axios from "axios";

// Dynamically load the backend URL from the environment variable
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create a new user
export const createUser = async (name, email) => {
  const response = await axios.post(`${API_URL}/users/register`, { name, email });
  return response.data;
};

// Record a reaction (like/meh)
export const recordPreference = async (userId, productId, reaction) => {
  const response = await axios.post(`${API_URL}/preferences`, {
    userId,
    productId,
    reaction,
  });
  return response.data;
};

// Fetch preferences for a user
export const fetchPreferences = async (userId) => {
  const response = await axios.get(`${API_URL}/preferences/${userId}`);
  return response.data;
};
