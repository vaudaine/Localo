import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.css";
import defaultAvatar from "../assets/default-avatar.png";
import { FaStar, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
  const { userId } = useParams(); // Récupération de l'ID utilisateur depuis l'URL
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState("products"); // Onglet sélectionné
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    // Récupérer les infos du profil
    axios.get(`http://127.0.0.1:8000/products/users/${userId}`).then((res) => setUser(res.data));
    
    // Récupérer les produits en vente
    axios.get(`http://127.0.0.1:8000/products/products?seller=${userId}`).then((res) => setProducts(res.data));
    
    // Récupérer les publications
    axios.get(`http://127.0.0.1:8000/products/posts?user=${userId}`).then((res) => setPosts(res.data));
    
    // Récupérer les recommandations
    axios.get(`http://127.0.0.1:8000/products/recommended?user=${userId}`).then((res) => setRecommended(res.data));
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Faire une requête API pour suivre/désuivre l'utilisateur
  };

  return (
    <div className="profile-container">
      {user ? (
        <>
          {/* En-tête du profil */}
          <div className="profile-header">
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.description}</p>
              <p><strong>{user.followers}</strong> abonnés • <strong>{user.following}</strong> suivis</p>
              <button onClick={handleFollow} className={isFollowing ? "unfollow" : "follow"}>
                {isFollowing ? "Se désabonner" : "Suivre"}
              </button>
            </div>
            <img src={user.avatar || defaultAvatar} alt="Avatar" className="profile-avatar" />
            <FaExclamationTriangle className="report-button" title="Signaler ce profil" />
          </div>
          
          {/* Onglets Produits / Publications */}
          {/* <div className="profile-tabs">
            <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Produits</button>
            <button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>Publications</button>
          </div> */}

          {/* Contenu de l'onglet Produits */}
          {/* {tab === "products" && (
            <div className="product-list">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="product-card">
                    <p><strong>{product.name}</strong></p>
                    <p>{product.price} €</p>
                    <p>Stock : {product.quantity}</p>
                  </div>
                ))
              ) : (
                <p>Aucun produit en vente.</p>
              )}
            </div>
          )} */}

          {/* Contenu de l'onglet Publications */}
          {/* {tab === "posts" && (
            <div className="post-list">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <p>{post.content}</p>
                  </div>
                ))
              ) : (
                <p>Aucune publication.</p>
              )}
            </div>
          )} */}

          {/* Section recommandations */}
          {/* <div className="recommended-section">
            <h3>Recommandations</h3>
            <div className="recommended-list">
              {recommended.map((rec) => (
                <div key={rec.id} className="recommended-card">
                  <img src={rec.avatar || defaultAvatar} alt="Avatar" className="small-avatar" />
                  <p>{rec.name}</p>
                </div>
              ))}
            </div>
          </div> */}
          
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default ProfilePage;
