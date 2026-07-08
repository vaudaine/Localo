import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header({ isLoggedIn, setIsLoggedIn, userRole, setUserRole }) {

  const handleLogout = () => {
    localStorage.removeItem("accessToken");  // Supprime le token
    localStorage.removeItem("refreshToken"); // Supprime aussi le refresh token
    setIsLoggedIn(false);
    setUserRole(null);  // Réinitialisation du rôle utilisateur
  };

  return (
    <nav className="header">
      {/* Lien visible pour tout le monde */}
      <Link to="/">Accueil</Link>

      {isLoggedIn ? (
        <>
          {/* Liens pour les utilisateurs connectés */}
          <Link to="/">Acheter</Link>
          {userRole === "seller" && <Link to="/vendre">Vendre</Link>}
          {/* <Link to="/commandes">Mes Commandes</Link> */}
          <Link to="/cart">Mon Panier</Link>
          <Link to="/favoris">Mes Favoris</Link>

          {/* Profil et déconnexion */}
          <Link to="/profil">Mon Profil</Link>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Se Déconnecter
          </button>
        </>
      ) : (
        // Liens pour les utilisateurs non connectés
        <Link to="/login">Se Connecter</Link>
      )}
    </nav>
  );
}

export default Header;
