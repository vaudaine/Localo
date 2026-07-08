import React, { useState, useEffect } from "react";

function MyCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div>
      <h1>Mon Panier</h1>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <p><strong>{item.name}</strong></p>
                <p>Prix unitaire: {item.price} €</p>
                <p>Quantité: {item.quantity}</p>
                <p>Total: {item.price * item.quantity} €</p>
                <button onClick={() => removeFromCart(index)}>Supprimer</button>
              </li>
            ))}
          </ul>
          <h2>Total: {getTotal()} €</h2>
          <button onClick={() => alert("Commande confirmée !")}>
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
}

export default MyCart;
