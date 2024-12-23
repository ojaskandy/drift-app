import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const endpoint = isRegister
        ? "https://drift-app-nvmk.onrender.com/users/register"
        : "https://drift-app-nvmk.onrender.com/users/login";

      const response = await axios.post(endpoint, formData);

      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect to the Home page
      navigate("/home");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        {isRegister && (
          <>
            <label>
              Full Name:
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                style={{ display: "block", margin: "10px 0" }}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ display: "block", margin: "10px 0" }}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                style={{ display: "block", margin: "10px 0" }}
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
            style={{ display: "block", margin: "10px 0" }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ display: "block", margin: "10px 0" }}
          />
        </label>
        <button type="submit" style={{ marginTop: "10px" }}>
          {loading ? "Loading..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      {errorMessage && <p style={{ marginTop: "20px", color: "red" }}>{errorMessage}</p>}
      <p
        style={{ cursor: "pointer", marginTop: "20px", color: "blue" }}
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  );
}
