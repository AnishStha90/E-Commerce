// src/pages/Product/ProductDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import { WishlistContext } from '../../context/WishlistContext';
import { addToCart } from '../../api/cartApi'; // import cart API

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const { wishlist, addItem, removeItem, loading: wishlistLoading } = useContext(WishlistContext);

  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:5000';

  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/400x300?text=No+Image';
    const path = typeof img === 'string' ? img : img.url;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleWishlist = () => {
    if (!userId) {
      alert("Please log in to manage your wishlist.");
      return;
    }
    if (wishlist.includes(product._id)) removeItem(product._id);
    else addItem(product._id);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please log in to add products to your cart.");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, 1); // default quantity 1
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!userId) {
      alert("Please log in to buy products.");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, 1); // add to cart before buying
      navigate("/cart"); // redirect to cart for checkout
    } catch (err) {
      console.error("Failed to buy product:", err);
      alert("Failed to proceed. Try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading || wishlistLoading) return <p style={{ textAlign: 'center' }}>Loading product...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!product) return <p style={{ textAlign: 'center' }}>Product not found.</p>;

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Wishlist Heart Icon */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          fontSize: '1.8rem',
          color: wishlist.includes(product._id) ? '#dc2626' : '#ccc',
          cursor: 'pointer',
        }}
        onClick={handleWishlist}
      >
        ❤️
      </div>

      {/* Images Section */}
      <div style={{ flex: '1 1 300px' }}>
        <img
          src={getImageUrl(product.images[mainImageIndex])}
          alt={product.name}
          onMouseEnter={() => setHoveredIndex(mainImageIndex)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            width: '100%',
            maxWidth: '400px',
            marginBottom: '1rem',
            objectFit: 'cover',
            borderRadius: '8px',
            transition: 'transform 0.3s ease',
            transform: hoveredIndex === mainImageIndex ? 'scale(1.1)' : 'scale(1)',
            cursor: 'pointer',
          }}
        />

        {/* Thumbnail Strip */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <img
                key={index}
                src={getImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImageIndex(index)}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                  border: mainImageIndex === index ? '2px solid #1d3557' : '1px solid #ccc',
                  cursor: 'pointer',
                }}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>

      {/* Product Info Section */}
      <div style={{ flex: '1 1 300px', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '1rem' }}>{product.name}</h2>
        <p style={{ fontWeight: 'bold', color: '#e63946', marginBottom: '1rem' }}>
          Price: ${product.price}
        </p>
        <p style={{ marginBottom: '1rem' }}>{product.description}</p>
        <p style={{ marginBottom: '0.5rem' }}>
          Category: {product.category?.name || 'N/A'}
        </p>
        <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Buttons */}
        <div style={{ marginTop: '15px' }}>
          {product.stock > 0 ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1d3557',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  marginRight: '10px',
                }}
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ff9900',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                💳 Buy Now
              </button>
            </>
          ) : (
            <button
              onClick={handleWishlist}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: wishlist.includes(product._id) ? '#dc2626' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              ❤️ {wishlist.includes(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
