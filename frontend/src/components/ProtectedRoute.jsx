import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../api/cartApi";

export default function ProductCard({ product, onCartUpdate }) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await addToCart(product._id, 1); // add 1 quantity
      alert(`${product.name} added to cart!`);
      if (onCartUpdate) onCartUpdate(); // optional callback to refresh cart
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500">${product.price}</p>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
