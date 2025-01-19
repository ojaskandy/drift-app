import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreatorLogin, setShowCreatorLogin] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL;
  
      if (!API_URL) {
        throw new Error("Backend URL is not defined in the environment variables.");
      }
  
      const endpoint = isRegister
        ? `${API_URL}/users/register`
        : `${API_URL}/users/login`;
  
      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
      });
  
      if (response.status === 200 || response.status === 201) {
        const { fullName } = response.data; // Extract fullName from backend response
        localStorage.setItem("userName", fullName); // Store fullName in localStorage
  
        if (type === "creator") {
          navigate("/creator"); // Navigate to the Creator page
        } else {
          navigate("/home"); // Navigate to the User interface
        }
      } else {
        throw new Error("Unexpected response status from the backend.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      {/* Creator Page Button with Hover Pop-Up */}
      <div
        className="creator-button-container"
        onMouseEnter={() => setShowCreatorLogin(true)}
        onMouseLeave={() => setShowCreatorLogin(false)}
      >
        <button className="creator-button">Creator Page</button>
        {showCreatorLogin && (
          <div className="creator-login-popup">
            <h1>{isRegister ? "Creator Register" : "Creator Login"}</h1>
            <form onSubmit={(e) => handleSubmit(e, "creator")}>
              {isRegister && (
                <>
                  <label>
                    Full Name:
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Phone Number:
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </label>
                </>
              )}
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : isRegister ? "Register" : "Login"}
              </button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <p className="toggle" onClick={() => setIsRegister(!isRegister)}>
              {isRegister
                ? "Already have a Creator account? Login"
                : "Don't have a Creator account? Register"}
            </p>
          </div>
        )}
      </div>

      {/* Floating Shapes */}
      <div className="shape-container">
        <div className="shape circle"></div>
        <div className="shape triangle"></div>
        <div className="shape square"></div>
      </div>

      {/* Logo and Description */}
      <div className="logo-container">
        <div className="logo">DRIFT</div>
        <p className="description">
          Discover, engage, and shop live with the brands you love.
        </p>
      </div>

      {/* Login/Register Form */}
      <div className="form-container">
        <h1>{isRegister ? "Register" : "Login"}</h1>
        <form onSubmit={(e) => handleSubmit(e, "user")}>
          {isRegister && (
            <>
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </label>
            </>
          )}
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Register" : "Login"}
          </button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <p className="toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}
