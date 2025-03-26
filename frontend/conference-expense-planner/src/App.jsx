import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
//import AdminPanel from "./pages/AdminPanel";  // Admin Dashboard
//import ProductsPage from "./pages/ProductsPage";  // Customer Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
       
      </Routes>
    </Router>
  );
}

export default App;

