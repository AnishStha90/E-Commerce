import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/home.css';
import { getProducts } from "../../api/productApi";
import noImage from '../../assets/images/no-image.png';
import { FaHeart } from 'react-icons/fa';
import { WishlistContext } from "../../context/WishlistContext";

function HomePage() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { wishlist, addItem, removeItem } = useContext(WishlistContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const getImageUrl = (imgPath) => {
    if (!imgPath) return noImage;
    return `http://localhost:5000${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        const productsArray = Array.isArray(products) ? products : products.products || [];

        setAllProducts(productsArray);

        const flashSaleAll = productsArray.filter(p => p.discount && p.discount > 0);
        setFlashSaleProducts(shuffleArray(flashSaleAll).slice(0, 4));
        setDisplayedProducts(shuffleArray(productsArray).slice(0, 8));
      } catch (err) {
        setError("Failed to load products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
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

  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

  const renderProductCard = (product) => {
    const isInWishlist = wishlist.includes(product._id);
    return (
      <div
        key={product._id}
        className="productCard"
        onClick={() => handleProductClick(product._id)}
        style={{
          position: 'relative',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <FaHeart
          onClick={(e) => handleWishlist(product._id, e)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: isInWishlist ? '#dc2626' : '#ccc',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        />

        <img
          src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : noImage}
          alt={product.name}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px', marginBottom: '5px' }}
        />

        <h3>{product.name}</h3>
        <p>
          <span className="originalPrice">${product.price.toFixed(2)}</span>{" "}
          {product.discount > 0 && (
            <span className="discountedPrice">
              ${(product.price * (1 - product.discount)).toFixed(2)}
            </span>
          )}
        </p>

        {/* Stock Messages */}
        {product.stock === 0 ? (
          <p style={{ color: "#dc2626", fontWeight: "bold" }}>❌ Out of Stock</p>
        ) : product.stock <= 10 ? (
          <p style={{ color: "#dc2626", fontWeight: "bold" }}>⚠️ Low Stock: {product.stock} left</p>
        ) : null}

        <div style={{ marginTop: "10px" }}>
          {/* Buy Now */}
          <button
            onClick={(e) => { e.stopPropagation(); handleBuyNow(product._id); }}
            style={{
              width: '100%',
              backgroundColor: "#ff9900",
              border: "none",
              borderRadius: "5px",
              color: "#fff",
              padding: "8px 12px",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              opacity: product.stock === 0 ? 0.6 : 1,
            }}
            disabled={product.stock === 0}
          >
            💳 Buy Now
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to ShopEase</h1>
        <p>Your one-stop shop for all the latest gadgets.</p>
        <button className="shopNowBtn">Shop Now</button>
      </section>

      {/* Flash Sale Section */}
      <section className="flashSale">
        <h2>Flash Sale 🔥</h2>
        {flashSaleProducts.length === 0 ? (
          <p>No flash sale products at the moment.</p>
        ) : (
          <div className="flashSaleList" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
            {flashSaleProducts.map(renderProductCard)}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="productGridSection">
        <h2>Featured Products</h2>
        {displayedProducts.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="productGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
            {displayedProducts.map(renderProductCard)}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
