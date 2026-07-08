import React from "react";
import "../styles/SearchBar.css";

function SearchBar({ product, setProduct, searchProducts }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchProducts();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        id="search-input"
        className="search-input"
        placeholder="Rechercher un produit..."
        value={product || ""}
        onChange={(e) => setProduct(e.target.value)}
        onKeyDown={handleKeyDown} // 🔹 Recherche avec la touche "Enter"
      />
      <button onClick={searchProducts}>Rechercher</button>
    </div>
  );
}

export default SearchBar;
