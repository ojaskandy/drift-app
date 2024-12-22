import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend server URL

// Create a new user
export const createUser = async (name, email) => {
  const response = await axios.post(`${API_URL}/users`, { name, email });
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
