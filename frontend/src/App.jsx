import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reels from "./pages/Reels";

function App() {
  return (
    <div style={{ height: "100vh", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reels" element={<Reels />} />
          <Route
            path="*"
            element={<h1 style={{ textAlign: "center" }}>404: Page Not Found</h1>}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
