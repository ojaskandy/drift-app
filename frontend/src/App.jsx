import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reels from "./pages/Reels";

function App() {
  return (
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
  );
}

export default App;
