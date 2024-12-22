import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Reels from "./pages/Reels";

function App() {
  return (
    <Router>
      <header>
        <h1>Live Shopping</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/reels">Reels</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reels" element={<Reels />} />
      </Routes>
    </Router>
  );
}

export default App;
