import React, { useState, useEffect } from "react";
import "./Discover.css";

const API_KEY = import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Fetch backend URL from environment variables

export default function Discover() {
  const [videoUrls, setVideoUrls] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchUploadedVideos = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/videos`);
      if (!response.ok) throw new Error("Error fetching uploaded videos");
      const videos = await response.json();

      return videos.map((video) => {
        // Handle both local uploads and YouTube videos
        if (video.url.startsWith("/uploads")) {
          return `${BACKEND_URL}${video.url}`;
        }
        return video.url;
      });
    } catch (err) {
      console.error("Error fetching uploaded videos:", err);
      return [];
    }
  };

  const fetchYouTubeVideos = async (pageToken = null) => {
    try {
      const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=shopping+deals&order=viewCount&maxResults=10&key=${API_KEY}`;
      const url = pageToken ? `${baseUrl}&pageToken=${pageToken}` : baseUrl;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching YouTube videos");
      const data = await response.json();
      setNextPageToken(data.nextPageToken || null); // Save nextPageToken for pagination
      return data.items.map(
        (item) => `https://www.youtube.com/embed/${item.id.videoId}`
      );
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
      setError("Error loading YouTube videos. Please try again later.");
      return [];
    }
  };

  const fetchAllVideos = async () => {
    try {
      setLoading(true);
      const uploadedVideos = await fetchUploadedVideos(); // Fetch uploaded videos
      const youtubeVideos = await fetchYouTubeVideos(); // Fetch YouTube videos
      setVideoUrls([...uploadedVideos, ...youtubeVideos]); // Combine uploaded and YouTube videos
      setLoading(false);
    } catch (err) {
      console.error("Error loading videos:", err);
      setError("Error loading videos. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVideos(); // Fetch videos when the component mounts
  }, []);

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = async () => {
    if (currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else if (nextPageToken && !isFetchingMore) {
      setIsFetchingMore(true);
      const additionalVideos = await fetchYouTubeVideos(nextPageToken);
      setVideoUrls((prevUrls) => [...prevUrls, ...additionalVideos]);
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
      setIsFetchingMore(false);
    }
  };

  return (
    <div className="discover-container">
      <div className="video-wrapper">
        {loading && currentVideoIndex === 0 ? (
          <p>Loading videos...</p>
        ) : error ? (
          <p>{error}</p>
        ) : videoUrls.length > 0 ? (
          <iframe
            src={videoUrls[currentVideoIndex]}
            title={`Video ${currentVideoIndex}`}
            allowFullScreen
            className="reel-video"
          ></iframe>
        ) : (
          <p>No videos found.</p>
        )}
      </div>

      <div className="controls">
        <button
          className="arrow-button up-arrow"
          onClick={handlePrevious}
          disabled={currentVideoIndex === 0}
        >
          ↑
        </button>
        <button
          className="arrow-button down-arrow"
          onClick={handleNext}
          disabled={
            currentVideoIndex === videoUrls.length - 1 &&
            !nextPageToken &&
            !isFetchingMore
          }
        >
          ↓
        </button>
      </div>

      {isFetchingMore && <p>Loading more videos...</p>}
    </div>
  );
}
