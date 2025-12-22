// src/pages/Vendor/VendorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/productApi';

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div style={{ paddingLeft: '4cm' }}>Loading...</div>;
  if (error) return <div style={{ paddingLeft: '4cm' }}>{error}</div>;

  const lowStockProducts = products.filter((p) => (p.stock ?? 0) <= 10);
  const topSellingProducts = [...products].sort((a, b) => (b.totalSell ?? 0) - (a.totalSell ?? 0));

  const renderImages = (images) => {
    if (!images || images.length === 0) return '/placeholder.png';
    return images.map((img, index) => (
      <img
        key={index}
        src={`http://localhost:5000${img}`}
        alt={`Product ${index + 1}`}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '5px',
          marginBottom: '5px',
        }}
      />
    ));
  };

  return (
    <div
      className="vendor-dashboard"
      style={{ paddingLeft: '4cm', paddingTop: '20px', paddingRight: '20px' }}
    >
      {/* Low Stock */}
      {lowStockProducts.length > 0 && (
        <>
          <h2 style={{ color: '#dc2626' }}>⚠️ Low Stock Products (≤ 10)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px', marginBottom: '40px' }}>
            {lowStockProducts.map((product) => (
              <div
                key={product._id}
                style={{ border: '1px solid #f87171', borderRadius: '10px', padding: '10px', textAlign: 'center', backgroundColor: '#fff5f5' }}
              >
                {renderImages(product.images)}
                <h3 style={{ marginTop: '10px', color: '#b91c1c' }}>{product.name}</h3>
                <p>Stock: {product.stock ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All Products */}
      <h2>All Products (Stock)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}
          >
            {renderImages(product.images)}
            <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
            <p>Stock: {product.stock ?? 'N/A'}</p>
          </div>
        ))}
      </div>

      {/* Top Selling */}
      <h2 style={{ marginTop: '50px' }}>Top Selling Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
        {topSellingProducts.map((product) => (
          <div
            key={product._id}
            style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}
          >
            {renderImages(product.images)}
            <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
            <p>Total Sold: {product.totalSell ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
