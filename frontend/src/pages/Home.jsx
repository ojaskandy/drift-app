import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const categories = [
  {
    name: "Clothing",
    color: "#FF5733",
    image: "/public/clothes-background.png",
    companies: [
      { name: "Gucci", website: "https://www.gucci.com" },
      { name: "Levi's", website: "https://www.levi.com" },
      { name: "ASOS", website: "https://www.asos.com" },
      { name: "Nordstrom", website: "https://www.nordstrom.com" },
      { name: "Forever 21", website: "https://www.forever21.com" },
    ],
  },
  {
    name: "Technology",
    color: "#33FF57",
    image: "/public/technology-background.png",
    companies: [
      { name: "Dell", website: "https://www.dell.com" },
      { name: "HP", website: "https://www.hp.com" },
      { name: "Microsoft", website: "https://www.microsoft.com" },
      { name: "Logitech", website: "https://www.logitech.com" },
      { name: "Razer", website: "https://www.razer.com" },
    ],
  },
  {
    name: "Fashion + Beauty",
    color: "#3357FF",
    image: "/public/fashionbeauty-background.png",
    companies: [
      { name: "Sephora", website: "https://www.sephora.com" },
      { name: "Ulta", website: "https://www.ulta.com" },
      { name: "Fenty Beauty", website: "https://www.fentybeauty.com" },
      { name: "MAC Cosmetics", website: "https://www.maccosmetics.com" },
      { name: "Maybelline", website: "https://www.maybelline.com" },
    ],
  },
  {
    name: "Automobiles",
    color: "#FFC300",
    image: "/public/automobiles-background.png",
    companies: [
      { name: "CarMax", website: "https://www.carmax.com" },
      { name: "AutoNation", website: "https://www.autonation.com" },
      { name: "Tesla", website: "https://www.tesla.com" },
      { name: "Carvana", website: "https://www.carvana.com" },
      { name: "Vroom", website: "https://www.vroom.com" },
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
        <a href="/home" className="logo">
          DRIFT
        </a>
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
              backgroundColor: category.color,
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
