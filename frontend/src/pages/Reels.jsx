import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Reels.css";

const YOUTUBE_API_KEY = import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY;

export default function Reels() {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("name");
  const websiteUrl = searchParams.get("website");
  const [videoIds, setVideoIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [iframeError, setIframeError] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

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
        throw new Error(errorData.error.message || "Error fetching YouTube videos");
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

  const handleIframeError = () => {
    setIframeError(true);
  };

  const handleLike = () => {
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 1000);
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
      <header className="reels-header">
        <Link to="/home" className="drift-logo">
          DRIFT
        </Link>
      </header>
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
        <div className="like-container">
          <button className="like-button" onClick={handleLike}>
            Like
          </button>
          {likeAnimation && <div className="like-animation">Liked!</div>}
        </div>
      </div>
      <div className="iframe-section">
        {iframeError ? (
          <div className="iframe-error">
            <p>
              This site is currently not integrated into DRIFT. We will address
              this issue promptly and fix integration.
            </p>
            <p>
              Please contact{" "}
              <a href="mailto:ojaskandy@gmail.com">ojaskandy@gmail.com</a> with any
              other bugs.
            </p>
          </div>
        ) : websiteUrl ? (
          <iframe
            src={websiteUrl}
            title={`${companyName} Website`}
            className="iframe-box"
            allowFullScreen
            onError={handleIframeError}
          ></iframe>
        ) : (
          <p>No website available.</p>
        )}
      </div>
    </div>
  );
}
