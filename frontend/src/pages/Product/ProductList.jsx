// src/pages/Product/ProductList.jsx
import React, { useEffect, useState, useContext } from "react";
import { getProducts } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { WishlistContext } from "../../context/WishlistContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { wishlist, addItem, removeItem } = useContext(WishlistContext);

  const BASE_URL = "http://localhost:5000";

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    if (!userId) console.log("❌ User not logged in");
    else console.log("✅ User is logged in:", userId);
  }, [userId]);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150x150?text=No+Image";
    const path = typeof img === "string" ? img : img.url;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleWishlist = (productId, e) => {
    e.stopPropagation();
    if (!userId) return alert("Please login to manage your wishlist.");

    if (wishlist.includes(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    alert(`Proceeding to buy ${product.name}`);
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>All Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {products.map((product) => {
          const isInWishlist = wishlist.includes(product._id);
          return (
            <div
              key={product._id}
              onClick={() => navigate(`/productDetail/${product._id}`)}
              style={{
                position: "relative",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <FaHeart
                onClick={(e) => handleWishlist(product._id, e)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: isInWishlist ? "#dc2626" : "#ccc",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              />
              <img
                src={
                  product.images && product.images.length > 0
                    ? getImageUrl(product.images[0])
                    : "https://via.placeholder.com/150x150?text=No+Image"
                }
                alt={product.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
              />
              <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
              <p>Price: ${product.price}</p>

              {/* Stock Messages */}
              {product.stock === 0 ? (
                <p style={{ color: "#dc2626", fontWeight: "bold" }}>❌ Out of Stock</p>
              ) : product.stock <= 10 ? (
                <p style={{ color: "#dc2626", fontWeight: "bold" }}>
                  ⚠️ Low Stock: {product.stock} left
                </p>
              ) : null}

              <div style={{ marginTop: "15px" }}>
                {/* Add to Cart always visible */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  style={{
                    backgroundColor: "#f0c14b",
                    border: "1px solid #a88734",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginRight: "10px",
                    opacity: product.stock === 0 ? 0.6 : 1, // optional dim for stock 0
                  }}
                >
                  🛒 Add to Cart
                </button>

                {/* Buy Now only if stock > 0 */}
                {product.stock > 0 && (
                  <button
                    onClick={(e) => handleBuyNow(product, e)}
                    style={{
                      backgroundColor: "#ff9900",
                      border: "none",
                      borderRadius: "5px",
                      color: "#fff",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    💳 Buy Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
