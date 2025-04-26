import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
//import AdminPanel from "./pages/AdminPanel";  // Admin Dashboard
//import ProductsPage from "./pages/ProductsPage";  // Customer Dashboard
import ProductPage from "./components/ProductPage";
import LoginModal from "./components/LoginModal";
import SignupForm from "./components/SignupForm";
import AdminPanel from "./components/admin/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/products" element={<ProductPage />} />  
        <Route path="/admin" element={<AdminPanel/>} />
      </Routes>
    </Router>
  );
}

export default App;

