import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Reels from "./pages/Reels";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Set Login as the default route */}
        <Route path="/" element={<Login />} />
        <Route path="/reels" element={<Reels />} />
      </Routes>
    </Router>
  );
}
