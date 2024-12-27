import React, { useState } from "react";
import "./Home.css";

const categories = [
  {
    name: "Clothing",
    color: "#FF5733",
    image: "https://via.placeholder.com/300x200?text=Clothing",
    companies: [
      { name: "Gucci", website: "https://www.gucci.com" },
      { name: "Nike", website: "https://www.nike.com" },
      { name: "Adidas", website: "https://www.adidas.com" },
    ],
  },
  {
    name: "Technology",
    color: "#33FF57",
    image: "https://via.placeholder.com/300x200?text=Technology",
    companies: [
      { name: "Apple", website: "https://www.apple.com" },
      { name: "Google", website: "https://www.google.com" },
      { name: "Samsung", website: "https://www.samsung.com" },
    ],
  },
  {
    name: "Fashion + Beauty",
    color: "#3357FF",
    image: "https://via.placeholder.com/300x200?text=Fashion+Beauty",
    companies: [
      { name: "Chanel", website: "https://www.chanel.com" },
      { name: "Sephora", website: "https://www.sephora.com" },
      { name: "MAC", website: "https://www.maccosmetics.com" },
    ],
  },
  {
    name: "Automobiles",
    color: "#FFC300",
    image: "https://via.placeholder.com/300x200?text=Automobiles",
    companies: [
      { name: "Tesla", website: "https://www.tesla.com" },
      { name: "BMW", website: "https://www.bmw.com" },
      { name: "Mercedes", website: "https://www.mercedes-benz.com" },
    ],
  },
];

export default function Home() {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryName) => {
    setExpandedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="logo">DRIFT</h1>
      </header>
      <main className="categories-container">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`category-box ${
              expandedCategory === category.name ? "expanded" : ""
            }`}
            onClick={() => toggleCategory(category.name)}
            style={{
              backgroundColor: category.color,
              backgroundImage: `url(${category.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="category-title">{category.name}</h2>
            {expandedCategory === category.name && (
              <ul className="company-list">
                {category.companies.map((company) => (
                  <li key={company.name}>
                    <a
                      href={`/reels?name=${company.name}&website=${company.website}`}
                      className="company-link"
                    >
                      {company.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
