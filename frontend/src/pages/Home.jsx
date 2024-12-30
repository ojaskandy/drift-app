import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const categories = [
  {
    name: "Clothing",
    color: "#FF5733",
    image: "/clothes-background.png", // Updated path
    companies: [
      { name: "Gucci", website: "https://www.gucci.com" },
      { name: "Zara", website: "https://www.zara.com" },
      { name: "H&M", website: "https://www2.hm.com" },
      { name: "Levi's", website: "https://www.levi.com" },
      { name: "Uniqlo", website: "https://www.uniqlo.com" },
    ],
  },
  {
    name: "Technology",
    color: "#33FF57",
    image: "/technology-background.png", // Updated path
    companies: [
      { name: "Apple", website: "https://www.apple.com" },
      { name: "Samsung", website: "https://www.samsung.com" },
      { name: "Sony", website: "https://www.sony.com" },
      { name: "Dell", website: "https://www.dell.com" },
      { name: "Lenovo", website: "https://www.lenovo.com" },
    ],
  },
  {
    name: "Fashion + Beauty",
    color: "#3357FF",
    image: "/fashionbeauty-background.png", // Updated path
    companies: [
      { name: "Chanel", website: "https://www.chanel.com" },
      { name: "Sephora", website: "https://www.sephora.com" },
      { name: "MAC", website: "https://www.maccosmetics.com" },
      { name: "Dior", website: "https://www.dior.com" },
      { name: "Maybelline", website: "https://www.maybelline.com" },
    ],
  },
  {
    name: "Automobiles",
    color: "#FFC300",
    image: "/automobiles-background.png", // Updated path
    companies: [
      { name: "Tesla", website: "https://www.tesla.com" },
      { name: "BMW", website: "https://www.bmw.com" },
      { name: "Mercedes", website: "https://www.mercedes-benz.com" },
      { name: "Audi", website: "https://www.audi.com" },
      { name: "Ford", website: "https://www.ford.com" },
    ],
  },
];

export default function Home() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [welcomeColor, setWelcomeColor] = useState("#333");
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem("user"))?.name?.split(" ")[0] || "Guest";

  useEffect(() => {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;
    setWelcomeColor(randomColor);
  }, []);

  const toggleCategory = (categoryName) => {
    setExpandedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <div className="home-container">
      <header className="header">
        <Link to="/home" className="logo">
          DRIFT
        </Link>
        <h2 className="welcome-text" style={{ color: welcomeColor }}>
          Welcome, {userName}!
        </h2>
        <Link to="/reels" className="reels-link">
          Reels
        </Link>
      </header>
      <main className="categories-container">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-box"
            onClick={() => toggleCategory(category.name)}
            style={{
              backgroundImage: `url(${category.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2>{category.name}</h2>
            {expandedCategory === category.name && (
              <ul className="company-list">
                {category.companies.map((company) => (
                  <li key={company.name}>
                    <Link
                      to={`/reels?name=${company.name}&website=${encodeURIComponent(
                        company.website
                      )}`}
                      className="company-link"
                    >
                      {company.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>
      <div className="discover-container">
        <button className="discover-button" onClick={() => navigate("/reels")}>
          Discover
        </button>
      </div>
    </div>
  );
}
