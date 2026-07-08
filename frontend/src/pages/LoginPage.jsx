import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn, setUserRole }) {
  const [isRegistering, setIsRegistering] = useState(false); // État pour basculer entre connexion et inscription
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Pour l'inscription
  const [userType, setUserType] = useState("buyer"); // Type d'utilisateur
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook pour la redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/products/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        const userData = await axios.get(`http://127.0.0.1:8000/products/user_role/?username=${username}`);
        if (userData.data.role) {
          const role = userData.data.role; // "buyer" ou "seller"
          if (role) setUserRole(role);

        } else {
          setError("Erreur lors de la récupération du rôle.");
        }
        setIsLoggedIn(true);
        navigate("/"); // Rediriger vers la page d'accueil
      }
    } catch (err) {
      setError("Connexion échouée : identifiants incorrects.");
    }

    axios.post("http://127.0.0.1:8000/products/login/", { username, password })
  .then((response) => {
    console.log("Réponse de login :", response.data);  // Vérifie la réponse du backend
    if (response.data.access) {  // Vérifie que le token est bien renvoyé
      localStorage.setItem("accessToken", response.data.access);  // Stocke le token
      localStorage.setItem("refreshToken", response.data.refresh);  // Stocke le token
      console.log("Token enregistré :", localStorage.getItem("accessToken"));  // Vérification
    } else {
      console.error("Aucun token reçu !");
    }
  })
  .catch((error) => {
    console.error("Erreur de connexion :", error.response?.data || error);
  });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/products/register/", {
        username,
        password,
        user_type: userType, // Ajout du type d'utilisateur
      });
      console.log(response.data);
      if (response.status === 201) {
        setIsRegistering(false); // Retour à la page de connexion après inscription réussie
      }
    } catch (err) {
      setError("Inscription échouée : " + err.response?.data?.message || "Erreur serveur.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      {!isRegistering ? (
        <>
          <h1>Connexion</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label>Nom d'utilisateur :</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Mot de passe :</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Se Connecter</button>
          </form>
          <p>
            Pas encore inscrit ?{" "}
            <button onClick={() => setIsRegistering(true)}>S'enregistrer</button>
          </p>
        </>
      ) : (
        <>
          <h1>Inscription</h1>
          <form onSubmit={handleRegister}>
            <div>
              <label>Nom d'utilisateur :</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Mot de passe :</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirmez le mot de passe :</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Etes-vous producteur ? :</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="buyer">Non</option>
                <option value="seller">Oui</option>
              </select>
            </div>
            <button type="submit">S'enregistrer</button>
          </form>
          <p>
            Déjà inscrit ?{" "}
            <button onClick={() => setIsRegistering(false)}>Se connecter</button>
          </p>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
