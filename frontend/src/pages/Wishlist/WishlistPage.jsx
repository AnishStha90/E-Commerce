import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { getProducts } from "../../api/productApi";
import "../../assets/styles/wishlist.css";

export default function WishlistPage() {
  const { wishlist, removeItem, loading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchProducts();
  }, [userId]);

  if (!user) {
    return (
      <div className="wishlistPage">
        <h1>My Wishlist</h1>
        <p style={{ textAlign: "center" }}>
          Please{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            login
          </span>{" "}
          to view your wishlist.
        </p>
      </div>
    );
  }

  if (wishlistLoading) return <p style={{ textAlign: "center" }}>Loading your wishlist...</p>;

  const wishlistProducts = products.filter((p) => wishlist.includes(p._id));

  if (!wishlistProducts.length)
    return <p style={{ textAlign: "center" }}>Your wishlist is empty.</p>;

  return (
    <div className="wishlistPage">
      <h1>My Wishlist</h1>
      <div className="wishlistGrid">
        {wishlistProducts.map((item) => (
          <div
            className="wishlistItem"
            key={item._id}
            onClick={() => navigate(`/product/${item._id}`)}
          >
            <img
              src={
                item.images && item.images.length > 0
                  ? `${BASE_URL}${item.images[0]}`
                  : "https://via.placeholder.com/150x150?text=No+Image"
              }
              alt={item.name}
              className="wishlistImage"
            />
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <button
              className="removeButton"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item._id);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
