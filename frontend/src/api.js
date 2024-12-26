import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create a new user
export const createUser = async (name, email) => {
  const response = await axios.post(`${API_URL}/users/register`, { name, email });
  return response.data;
};

// Login a user
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/users/login`, { username, password });
  return response.data;
};

// Record a reaction
export const recordPreference = async (userId, productId, reaction) => {
  const response = await axios.post(`${API_URL}/preferences`, { userId, productId, reaction });
  return response.data;
};
