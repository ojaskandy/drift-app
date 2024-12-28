import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Reels.css";

// Correctly access the environment variable for Vite
const YOUTUBE_API_KEY = import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY;

export default function Reels() {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("name");
  const websiteUrl = searchParams.get("website");
  const [videoIds, setVideoIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!YOUTUBE_API_KEY) {
      setError("YouTube API Key is missing. Please configure it in the .env file.");
      setLoading(false);
      return;
    }

    if (companyName) {
      fetchYouTubeVideos(companyName);
    }
  }, [companyName]);

  const fetchYouTubeVideos = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
          query
        )}&maxResults=10&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("YouTube API error:", errorData);
        throw new Error(
          errorData.error.message || "Error fetching YouTube videos"
        );
      }

      const data = await response.json();
      const ids = data.items.map((item) => item.id.videoId);
      setVideoIds(ids);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
      setLoading(false);
      setError("Error loading reels. Please check API key configuration.");
    }
  };

  const handleNext = () => {
    if (currentIndex < videoIds.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="reels-container">
      <div className="reel-section">
        <div className="reel-box">
          {loading ? (
            <p>Loading reels...</p>
          ) : error ? (
            <p>{error}</p>
          ) : videoIds.length > 0 ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoIds[currentIndex]}?autoplay=1&mute=1&loop=1`}
              title="YouTube Reel"
              allowFullScreen
              className="reel-iframe"
            ></iframe>
          ) : (
            <p>No reels found.</p>
          )}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === videoIds.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      <div className="iframe-section">
        {websiteUrl ? (
          websiteUrl.includes("gucci.com") ||
          websiteUrl.includes("restricted-website.com") ? (
            <p>
              This website cannot be displayed in an embedded frame due to its
              security policy.
            </p>
          ) : (
            <iframe
              src={websiteUrl}
              title={`${companyName} Website`}
              className="iframe-box"
              allowFullScreen
            ></iframe>
          )
        ) : (
          <p>No website available.</p>
        )}
      </div>
    </div>
  );
}
