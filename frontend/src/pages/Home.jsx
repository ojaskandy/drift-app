import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const categories = [
  {
    name: "Clothing",
    background: "/clothes-background.png",
    companies: [
      { name: "Gucci", website: "https://www.gucci.com" },
      { name: "Levi's", website: "https://www.levi.com" },
      { name: "Uniqlo", website: "https://www.uniqlo.com" },
      { name: "Nike", website: "https://www.nike.com" },
      { name: "Adidas", website: "https://www.adidas.com" },
    ],
  },
  {
    name: "Technology",
    background: "/technology-background.png",
    companies: [
      { name: "Dell", website: "https://www.dell.com" },
      { name: "HP", website: "https://www.hp.com" },
      { name: "Lenovo", website: "https://www.lenovo.com" },
      { name: "Apple", website: "https://www.apple.com" },
      { name: "Microsoft", website: "https://www.microsoft.com" },
    ],
  },
  {
    name: "Fashion + Beauty",
    background: "/fashionbeauty-background.png",
    companies: [
      { name: "Sephora", website: "https://www.sephora.com" },
      { name: "Dior", website: "https://www.dior.com" },
      { name: "Chanel", website: "https://www.chanel.com" },
      { name: "MAC", website: "https://www.maccosmetics.com" },
      { name: "Maybelline", website: "https://www.maybelline.com" },
    ],
  },
  {
    name: "Automobiles",
    background: "/automobiles-background.png",
    companies: [
      { name: "Tesla", website: "https://www.tesla.com" },
      { name: "BMW", website: "https://www.bmw.com" },
      { name: "Mercedes-Benz", website: "https://www.mercedes-benz.com" },
      { name: "Ford", website: "https://www.ford.com" },
      { name: "Audi", website: "https://www.audi.com" },
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const userName =
    JSON.parse(localStorage.getItem("user"))?.name?.split(" ")[0] || "Guest";

  const handleCategoryClick = (company) => {
    navigate(
      `/reels?name=${company.name}&website=${encodeURIComponent(
        company.website
      )}`
    );
  };

  return (
    <div className="home-container">
      <header className="header">
        <a href="/home" className="logo">
          DRIFT
        </a>
        <h2 className="welcome-text">Welcome, {userName}!</h2>
        <a href="/reels" className="reels-link">
          Reels
        </a>
      </header>
      <main className="categories-container">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-box"
            style={{
              backgroundImage: `url(${category.background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2>{category.name}</h2>
            <ul className="company-list">
              {category.companies.map((company) => (
                <li key={company.name}>
                  <button
                    onClick={() => handleCategoryClick(company)}
                    className="company-link"
                  >
                    {company.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
      <button className="discover-button" onClick={() => navigate("/reels")}>
        Discover
      </button>
    </div>
  );
}
