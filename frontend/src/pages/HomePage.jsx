import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import "../styles/SearchBar.css";

function HomePage() {
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Charger le panier depuis le localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Fonction pour enregistrer le panier dans le localStorage
  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const searchProducts = async () => {
    if (!product.trim()) {
      setError("Veuillez entrer un nom de produit.");
      return;
    }

    try {
      setError("");
      const response = await axios.get(
        `http://127.0.0.1:8000/products/get_products/?name=${encodeURIComponent(product)}`
      );

      console.log("Données reçues :", response.data);
      setProducts(response.data);
    } catch (err) {
      console.error("Erreur lors de la recherche :", err.response?.data || err);
      setError(err.response?.data?.error || "Aucun produit trouvé ou erreur serveur.");
      setProducts([]);
    }
  };

  // Fonction pour ouvrir la modale et choisir la quantité
  const openModal = (prod) => {
    setSelectedProduct(prod);
    setQuantity(1);
  };

  // Calcul du sous-total
  const subtotal = selectedProduct ? (selectedProduct.price * quantity).toFixed(2) : 0;

  // Fonction pour ajouter au panier
  const addToCart = () => {
    if (!selectedProduct) return;

    const existingProduct = cart.find((item) => item.name === selectedProduct.name);
    
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.name === selectedProduct.name
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { ...selectedProduct, quantity }]);
    }

    setSelectedProduct(null); // Fermer la modale
  };

  return (
    <div className="container">
      <SearchBar product={product} setProduct={setProduct} searchProducts={searchProducts} />
      {error && <p className="error-message">{error}</p>}
      
      <ul className="results-list">
        {products.map((prod, index) => (
          <li key={index} className="result-item">
            <p><strong>Nom :</strong> {prod.name}</p>
            <p><strong>Prix :</strong> {prod.price} €</p>
            <p><strong>Producteur :</strong> {prod.producer}</p>
            <p><strong>Stock :</strong> {prod.stock} {prod.sale_type === "weight" ? "kg" : "pcs"}</p>
            <button onClick={() => openModal(prod)}>Ajouter au panier</button>
          </li>
        ))}
      </ul>

      {/* Modale de sélection de quantité */}
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ajouter {selectedProduct.name} au panier</h2>
            <p><strong>Stock disponible :</strong> {selectedProduct.stock} {selectedProduct.sale_type === "weight" ? "kg" : "pcs"}</p>
            
            <label>Quantité :</label>
            <input
              type="number"
              min="1"
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(selectedProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
            />
            
            <p><strong>Sous-total :</strong> {subtotal} €</p>
            
            <button onClick={addToCart}>Confirmer</button>
            <button onClick={() => setSelectedProduct(null)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
