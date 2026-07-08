import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SellingPage from "./pages/SellingPage";
import MyCart from "./pages/MyCart";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <div className="main-container">
        {/* Header */}
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} setUserRole={setUserRole} />

        {/* Contenu principal */}
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/commandes" element={<OrdersPage />} />
            <Route path="/vendre" element={<SellingPage />} />
            <Route path="/favoris" element={<FavoritesPage />} />
            <Route path="/profil" element={isLoggedIn ? <ProfilePage isLoggedIn={isLoggedIn} /> : <LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/cart" element={<MyCart/>} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

