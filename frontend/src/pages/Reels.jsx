import React from "react";
import { useLocation } from "react-router-dom";
import "./Reels.css";

export default function Reels() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyName = params.get("name");
  const companyWebsite = params.get("website");

  return (
    <div className="reels-page">
      <div className="reels-section">
        <h1>{companyName} Reels</h1>
        <div className="reel-placeholder">
          <img
            src={`https://via.placeholder.com/300x200?text=${companyName}`}
            alt={`${companyName} Reel`}
            className="reel-image"
          />
        </div>
      </div>
      <div className="website-section">
        <iframe
          src={`http://localhost:8080/${companyWebsite}`}
          title={`${companyName} Website`}
          className="website-frame"
        ></iframe>
      </div>
    </div>
  );
}
