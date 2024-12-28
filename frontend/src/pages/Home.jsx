import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const categories = [
  {
    name: "Clothing",
    color: "#FF5733",
    image: "https://via.placeholder.com/300x200?text=Clothing",
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
    image: "https://via.placeholder.com/300x200?text=Technology",
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
    image: "https://via.placeholder.com/300x200?text=Fashion+Beauty",
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
    image: "https://via.placeholder.com/300x200?text=Automobiles",
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
            className="category-box"
            key={category.name}
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
    </div>
  );
}
