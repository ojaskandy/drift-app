import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [welcomeText, setWelcomeText] = useState("");

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
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="home-container">
      <h1 className="logo">DRIFT</h1>
      {user ? (
        <>
          <h2 className="welcome-text">{welcomeText}</h2>
          <Link to="/reels" className="reels-link">
            Go to Reels
          </Link>
        </>
      ) : (
        <h2 className="welcome-text">Welcome to Drift!</h2>
      )}

      <div className="footer">
        Server is not primed for large-scale usage. For all bugs, questions, and
        feedback, contact <b>ojaskandy@gmail.com</b>.
      </div>
    </div>
  );
}
