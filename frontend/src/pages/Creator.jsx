import React, { useState } from "react";
import "./Creator.css";

export default function Creator() {
  const [videoLink, setVideoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleLinkSubmit = async () => {
    if (!videoLink.trim()) {
      setMessage("Please provide a valid video link.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/videos/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoLink }),
      });

      if (!response.ok) throw new Error("Failed to submit video link.");

      setMessage("Video link submitted successfully!");
      setVideoLink("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit video link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="creator-container">
      <header className="creator-header">
        <h1>Welcome, Creator!</h1>
        <p>Manage your live streams and uploaded videos here.</p>
      </header>

      <section className="upload-section">
        <h2>Submit Video Link</h2>
        <input
          type="url"
          placeholder="Enter YouTube or video link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          disabled={isSubmitting}
        />
        <button onClick={handleLinkSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {message && <p className="upload-message">{message}</p>}
      </section>

      <section className="navigation-section">
        <h2>Navigation</h2>
        <button onClick={() => (window.location.href = "/home")}>Go to Home</button>
        <button onClick={() => (window.location.href = "/discover")}>
          Go to Discover
        </button>
      </section>
    </div>
  );
}
