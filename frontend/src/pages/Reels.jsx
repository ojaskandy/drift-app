import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Reels.css";
import io from "socket.io-client";

const YOUTUBE_API_KEY = import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY;
const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(SOCKET_SERVER_URL);

export default function Reels() {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("name");
  const websiteUrl = searchParams.get("website");
  const [videoIds, setVideoIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [iframeError, setIframeError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch logged-in username from localStorage
  const username = JSON.parse(localStorage.getItem("user"))?.username || "Anonymous";

  useEffect(() => {
    if (!YOUTUBE_API_KEY) {
      setError("YouTube API Key is missing. Please configure it in the .env file.");
      setLoading(false);
      return;
    }

    if (companyName) {
      fetchYouTubeVideos(companyName);
    }

    // Fetch chat history when the component mounts
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    // Append new incoming messages to the chat
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
    };
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("send-message", { username, text: newMessage }); // Send message to the backend
      setNewMessage(""); // Clear the input field
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
          <button onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}>
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(i + 1, videoIds.length - 1))
            }
          >
            Next
          </button>
        </div>
      </div>
      <div className="iframe-section">
        {iframeError ? (
          <div className="iframe-error">
            <p>This site is not integrated. We will fix this issue.</p>
          </div>
        ) : websiteUrl ? (
          <iframe
            src={websiteUrl}
            title={`${companyName} Website`}
            className="iframe-box"
            onError={() => setIframeError(true)}
          ></iframe>
        ) : (
          <p>No website provided.</p>
        )}
      </div>
      <div className="chat-section">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.username === username ? "my-message" : "other-message"
              }`}
            >
              <strong>{message.username}</strong>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
