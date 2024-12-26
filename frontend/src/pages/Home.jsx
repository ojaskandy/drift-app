import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [welcomeText, setWelcomeText] = useState("");
  const [welcomeColor, setWelcomeColor] = useState("#000"); // Default color
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const name = `Welcome, ${user.name.split(" ")[0]}!`;
      let index = 0;
      const interval = setInterval(() => {
        setWelcomeText((prev) => prev + name[index]);
        index++;
        if (index === name.length) clearInterval(interval);
      }, 100); // Adjust the speed of animation
      setWelcomeColor(getRandomColor()); // Change color
      return () => clearInterval(interval);
    }
  }, [user]);

  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFC300", "#DA33FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="logo" onClick={handleLogoClick}>
          DRIFT
        </h1>
        <nav>
          <Link to="/reels" className="nav-link">
            Reels
          </Link>
          <Link to="/cart" className="nav-link cart">
            Shopping Cart
          </Link>
        </nav>
      </header>
      <main>
        {user ? (
          <>
            <h2 className="welcome-text" style={{ color: welcomeColor }}>
              {welcomeText}
            </h2>
          </>
        ) : (
          <h2 className="welcome-text">Welcome to Drift!</h2>
        )}
        <div className="footer">
          Server is not primed for large-scale usage. For all bugs, questions,
          and feedback, contact <b>ojaskandy@gmail.com</b>.
        </div>
      </main>
    </div>
  );
}
