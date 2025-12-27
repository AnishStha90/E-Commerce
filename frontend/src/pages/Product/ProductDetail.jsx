// src/pages/Product/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { wishlist, addItem, removeItem, loading: wishlistLoading } = useWishlist();
  const { addItem: addCartItem } = useCart();
  const BASE_URL = "http://localhost:5000";

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    setProduct(null);
    setLoading(true);
    setError(null);

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x300?text=No+Image";
    const path = typeof img === "string" ? img : img.url;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const redirectToLogin = () => {
    navigate("/login", { state: { from: `/product/${id}` } });
  };

  const isInWishlist = product && Array.isArray(wishlist)
    ? wishlist.includes(product._id)
    : false;

  const handleWishlist = () => {
    if (!userId) return redirectToLogin();
    if (isInWishlist) removeItem(product._id);
    else addItem(product._id);
  };

  const handleAddToCart = async () => {
    if (!userId) return redirectToLogin();
    try {
      setAddingToCart(true);
      await addCartItem(product._id, quantity);
      alert(`${product.name} (x${quantity}) added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!userId) return redirectToLogin();
    try {
      setAddingToCart(true);
      await addCartItem(product._id, quantity);
      navigate("/checkout", {
        state: {
          items: [{ product, quantity }],
          total: product.price * quantity,
        },
      });
    } catch (err) {
      console.error("Failed to proceed to checkout:", err);
      alert("Failed to proceed to checkout.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product && next > product.stock) return product.stock;
      return next;
    });
  };

  if (loading || wishlistLoading)
    return <p style={{ textAlign: "center" }}>Loading product...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!product) return <p style={{ textAlign: "center" }}>Product not found.</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        padding: "2rem",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Wishlist Icon */}
      <div
        onClick={handleWishlist}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "1.8rem",
          color: isInWishlist ? "#dc2626" : "#ccc",
          cursor: "pointer",
        }}
      >
        ❤️
      </div>

      {/* Product Images */}
      <div style={{ flex: "1 1 300px" }}>
        <img
          src={getImageUrl(product.images[mainImageIndex])}
          alt={product.name}
          onMouseEnter={() => setHoveredIndex(mainImageIndex)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            transition: "transform 0.3s ease",
            transform: hoveredIndex === mainImageIndex ? "scale(1.1)" : "scale(1)",
          }}
        />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "10px" }}>
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={getImageUrl(img)}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setMainImageIndex(index)}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "5px",
                border: mainImageIndex === index ? "2px solid #1d3557" : "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div style={{ flex: "1 1 300px", maxWidth: "500px" }}>
        <h2>{product.name}</h2>
        <p style={{ color: "#e63946", fontWeight: "bold" }}>Price: ${product.price}</p>
        <p>{product.description}</p>
        <p style={{ fontWeight: "bold" }}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>

        {product.stock > 0 && (
          <div style={{ marginTop: "15px" }}>
            {/* Quantity Selector */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px" }}>
              <button
                onClick={() => handleQuantityChange(-1)}
                style={{ padding: "5px 10px" }}
              >-</button>
              <span>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                style={{ padding: "5px 10px" }}
              >+</button>
              <span style={{ marginLeft: 10, fontSize: "0.9rem", color: "#555" }}>Stock: {product.stock}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#1d3557",
                color: "#fff",
                border: "none",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={addingToCart}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#ff9900",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              💳 Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
