import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import noImage from "../../assets/images/no-image.png";
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { wishlist, addItem, removeItem, loading: wishlistLoading } = useWishlist();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const getImageUrl = (img) => {
    if (!img) return noImage;
    return `${BASE_URL}/${img.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (id) => navigate(`/product/${id}`);

  const handleWishlist = async (productId, e) => {
    e.stopPropagation();
    if (!userId) return toast.info("Please login to manage your wishlist.");

    try {
      if (wishlist.includes(productId)) await removeItem(productId);
      else await addItem(productId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist.");
    }
  };

  const handleBuyNow = (productId, e) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  if (loading || wishlistLoading) return <p>Loading products...</p>;
  if (!products.length) return <p>No products available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {products.map((p) => {
          const isInWishlist = wishlist.includes(p._id);
          return (
            <div
              key={p._id}
              className="productCard"
              onClick={() => handleProductClick(p._id)}
              style={{
                cursor: "pointer",
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                position: "relative",
                backgroundColor: "#fff",
              }}
            >
              <FaHeart
                onClick={(e) => handleWishlist(p._id, e)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: isInWishlist ? '#dc2626' : '#ccc',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: isInWishlist ? 'scale(1.2)' : 'scale(1)'
                }}
              />
              <img
                src={p.images?.[0] ? getImageUrl(p.images[0]) : noImage}
                alt={p.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px", marginBottom: '5px' }}
              />
              <h3>{p.name}</h3>
              <p>${p.price.toFixed(2)}</p>

              {p.stock === 0 && <p style={{ color: "#dc2626", fontWeight: "bold" }}>❌ Out of Stock</p>}

              {/* Show Buy Now button only if stock > 0 */}
              {p.stock > 0 && (
                <button
                  onClick={(e) => handleBuyNow(p._id, e)}
                  style={{
                    width: '100%',
                    backgroundColor: "#ff9900",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginTop: '10px'
                  }}
                >
                  💳 Buy Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
