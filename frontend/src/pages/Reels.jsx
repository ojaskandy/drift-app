import React, { useState } from "react";
import { recordPreference } from "../api";
import "./Reels.css";

export default function Reels() {
  const [reaction, setReaction] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "Unknown"; // Retrieve user ID from local storage
  const productId = "reel-01";

  const handleReaction = async (type) => {
    setReaction(type);
    try {
      await recordPreference(userId, productId, type);
      console.log(`Reaction '${type}' recorded for product ${productId}`);
    } catch (err) {
      console.error("Error recording reaction:", err);
    }
    setTimeout(() => setReaction(""), 2000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Reels Page</h1>
      <div
        style={{
          width: "300px",
          height: "500px",
          border: "2px solid black",
          margin: "20px auto",
          position: "relative",
          background: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "#888",
        }}
      >
        Reel Content
        {reaction && (
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "32px",
              fontWeight: "bold",
              color: reaction === "Like!" ? "green" : "red",
              animation: "fade-in-out 1s ease-in-out",
            }}
          >
            {reaction}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => handleReaction("Meh")}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            color: "white",
            backgroundColor: "red",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Meh
        </button>
        <button
          onClick={() => handleReaction("Like!")}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            color: "white",
            backgroundColor: "green",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Like!
        </button>
      </div>
    </div>
  );
}
