import React, { useState } from "react";
import axios from "axios";

function SellingPage() {
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        origin: "",
        sale_type: "piece",
        quantity: "", // 🔹 Ajout de la quantité
        description: "",
    });

    const [message, setMessage] = useState("");
    const categories = ["Fruits", "Légumes", "Viande", "Produits laitiers", "Céréales", "Autre"];

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
            try { const response = await axios.post("http://127.0.0.1:8000/products/token/refresh/",{ refresh: refreshToken });
                localStorage.setItem("accessToken", response.data.access);
                console.log("✅ Nouveau access token récupéré !");
            } catch (error) {
                console.error("⚠️ Erreur lors du rafraîchissement du token :", error.response?.data || error);
            }
        } else {
            console.log("❌ Aucun refresh token disponible. L'utilisateur doit se reconnecter.");
            setMessage("Par mesure de sécurité, veuillez vous reconnecter.");
            return;
        }

        console.log("Données envoyées :", product);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/products/create_product/",
                product,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            console.log("Réponse serveur :", response.data);

            if (response.status === 201) {
                setMessage("Produit ajouté avec succès !");
                setShowModal(false);
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout du produit :", error);
            setMessage("Échec de l'ajout du produit.");
        }
    };

    return (
        <div className="sell-page">
            <h1>Vendre un produit</h1>
            <button onClick={() => setShowModal(true)}>Vendre un produit</button>
            {message && <p>{message}</p>}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Ajouter un produit</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Nom du produit :</label>
                            <input type="text" name="name" value={product.name} onChange={handleChange} required />

                            <label>Catégorie :</label>
                            <select name="category" value={product.category} onChange={handleChange} required>
                                <option value="">Sélectionner...</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <label>Prix (€) :</label>
                            <input type="number" name="price" value={product.price} onChange={handleChange} required />

                            <label>Origine :</label>
                            <input type="text" name="origin" value={product.origin} onChange={handleChange} required />

                            <label>Mode de vente :</label>
                            <select name="sale_type" value={product.sale_type} onChange={handleChange}>
                                <option value="piece">À la pièce</option>
                                <option value="weight">Au poids</option>
                            </select>

                            <label>Quantité :</label>  {/* 🔹 Ajout du champ quantité */}
                            <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required />

                            <label>Description :</label>
                            <textarea name="description" value={product.description} onChange={handleChange} required />

                            <button type="submit">Valider</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellingPage;
