import React, { useState, useEffect } from "react";
import "./Creator.css";

export default function Creator() {
  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState([]);

  // Fetch the creator's name from sessionStorage/localStorage on component load
  useEffect(() => {
    const storedFullName = localStorage.getItem("userName"); // Retrieve fullName from localStorage
    if (storedFullName) {
      setCreatorName(storedFullName.split(" ")[0]); // Display only the first name
    }
  }, []);

  // Fetch the creator's uploaded videos
  useEffect(() => {
    const fetchUploadedVideos = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
        const response = await fetch(
          `http://localhost:10000/videos/creator/${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch uploaded videos.");
        }
        const videos = await response.json();
        setUploadedVideos(videos);
      } catch (error) {
        console.error("Error fetching uploaded videos:", error);
      }
    };

    fetchUploadedVideos();
  }, []);

  const handleLinkChange = (e) => {
    setVideoLink(e.target.value);
    setSubmitMessage("");
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setSubmitMessage("");
  };

  const convertToEmbedLink = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!videoLink && !videoFile) {
      setSubmitMessage("Please provide either a YouTube link or upload a video file.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      let response;
  
      if (videoFile) {
        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("creator", localStorage.getItem("username") || "Unknown Creator");
        formData.append("title", videoFile.name);
  
        response = await fetch("http://localhost:10000/videos/upload", {
          method: "POST",
          body: formData,
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
  
      const result = await response.json();
      setUploadedVideos((prev) => [result.video, ...prev]); // Update the list dynamically
      setSubmitMessage("Video uploaded successfully!");
      setVideoLink("");
      setVideoFile(null);
    } catch (error) {
      console.error("Error submitting video:", error);
      setSubmitMessage(`Failed to submit video. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="creator-container">
      <header className="creator-header">
        <h1>Welcome, {creatorName}!</h1>
        <p>Manage your live streams and uploaded videos here.</p>
      </header>

      <section className="upload-section">
        <h2>Submit Video</h2>
        <div className="input-group">
          <label>Enter YouTube Link:</label>
          <input
            type="url"
            placeholder="Enter YouTube link"
            value={videoLink}
            onChange={handleLinkChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="input-group">
          <label>Or Upload a Video File:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </section>

      <section className="uploaded-videos-section">
        <h2>Your Uploaded Videos</h2>
        <div className="uploaded-videos-container">
          {uploadedVideos.length > 0 ? (
            uploadedVideos.map((video) => (
              <div key={video._id} className="uploaded-video-item">
                <iframe
                  src={video.url}
                  title={video.title}
                  allowFullScreen
                  className="uploaded-video-iframe"
                ></iframe>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            ))
          ) : (
            <p>No videos uploaded yet.</p>
          )}
        </div>
      </section>

      <section className="navigation-section">
        <h2>Navigation</h2>
        <button onClick={() => (window.location.href = "/home")}>
          Go to Home
        </button>
        <button onClick={() => (window.location.href = "/discover")}>
          Go to Discover
        </button>
      </section>
    </div>
  );
}
