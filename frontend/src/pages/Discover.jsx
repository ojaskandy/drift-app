import React, { useState, useEffect, useCallback } from "react";
import "./Discover.css";

const API_KEY = import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY;

export default function Discover() {
  const [videoUrls, setVideoUrls] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchUploadedVideos = async () => {
    try {
      const response = await fetch("http://localhost:5000/videos"); // Fetch uploaded videos
      if (!response.ok) throw new Error("Error fetching uploaded videos");
      const uploadedVideos = await response.json();
      return uploadedVideos.map((video) => video.url); // Extract video URLs
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
      return data.items.map((item) => `https://www.youtube.com/embed/${item.id.videoId}`);
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
      setError("Error loading YouTube videos. Please try again later.");
      return [];
    }
  };

  const fetchAllVideos = async () => {
    try {
      setLoading(true);
      const uploadedVideos = await fetchUploadedVideos(); // Uploaded videos first
      const youtubeVideos = await fetchYouTubeVideos(); // YouTube videos
      setVideoUrls([...uploadedVideos, ...youtubeVideos]); // Combine uploaded and YouTube videos
      setLoading(false);
    } catch (err) {
      console.error("Error loading videos:", err);
      setError("Error loading videos. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVideos(); // Fetch all videos on page load
  }, []);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetchingMore && nextPageToken) {
      setIsFetchingMore(true);
      fetchYouTubeVideos(nextPageToken).then((urls) => {
        setVideoUrls((prev) => [...prev, ...urls]);
        setIsFetchingMore(false);
      });
    }
  }, [nextPageToken, isFetchingMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handlePrevious = () => {
    if (currentVideoIndex > 0) setCurrentVideoIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentVideoIndex < videoUrls.length - 1) setCurrentVideoIndex((prev) => prev + 1);
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
        <button className="arrow-button up-arrow" onClick={handlePrevious} disabled={currentVideoIndex === 0}>
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
