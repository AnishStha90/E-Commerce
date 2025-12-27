import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../api/cartApi";
import noImage from "../../assets/images/no-image.png";

const BASE_URL = "http://localhost:5000";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  /* ================= IMAGE HANDLER ================= */
  const getImageUrl = (product) => {
    if (!product) return noImage;

    if (product.image) {
      return `${BASE_URL}/${product.image.replace(/^\/+/, "")}`;
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      return `${BASE_URL}/${product.images[0].replace(/^\/+/, "")}`;
    }

    return noImage;
  };

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = await getCart();
      const products = data.products || [];

      setCartItems(products);

      // select all by default
      const selected = {};
      products.forEach((item) => {
        if (item.product?._id) {
          selected[item.product._id] = true;
        }
      });
      setSelectedItems(selected);
    } catch (err) {
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= REMOVE ITEM ================= */
  const handleRemove = async (productId) => {
    try {
      setUpdating(true);
      const data = await removeFromCart(productId);
      const products = data.products || [];

      setCartItems(products);

      // resync selection
      const selected = {};
      products.forEach((item) => {
        selected[item.product._id] = true;
      });
      setSelectedItems(selected);
    } catch (err) {
      alert("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;

    const item = cartItems.find((i) => i.product?._id === productId);
    if (!item) return;

    const diff = newQty - item.quantity;
    if (diff === 0) return;

    try {
      setUpdating(true);
      const data = await addToCart(productId, diff);
      const products = data.products || [];

      setCartItems(products);

      // keep selection
      setSelectedItems((prev) => {
        const updated = {};
        products.forEach((p) => {
          updated[p.product._id] = prev[p.product._id] ?? true;
        });
        return updated;
      });
    } catch (err) {
      alert("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= CLEAR CART ================= */
  const handleClearCart = async () => {
    if (!window.confirm("Clear cart?")) return;

    try {
      setUpdating(true);
      const data = await clearCart();
      setCartItems(data.products || []);
      setSelectedItems({});
    } catch (err) {
      alert("Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = () => {
    const selectedProducts = cartItems.filter(
      (item) => selectedItems[item.product?._id]
    );

    if (!selectedProducts.length) {
      alert("Please select at least one item to buy.");
      return;
    }

    navigate("/checkout", {
      state: {
        items: selectedProducts,
        total: totalAmount,
      },
    });
  };

  /* ================= TOTAL ================= */
  const totalAmount = cartItems.reduce((sum, item) => {
    if (selectedItems[item.product?._id]) {
      return sum + (item.product?.price || 0) * item.quantity;
    }
    return sum;
  }, 0);

  /* ================= UI ================= */
  if (loading) return <p style={{ textAlign: "center" }}>Loading cart...</p>;

  if (!cartItems.length)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/products")}>Shop Now</button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Your Cart</h2>

      <table width="100%" cellPadding={10}>
        <thead>
          <tr>
            <th>Select</th>
            <th align="left">Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {cartItems.map((item, index) => (
            <tr key={`${item.product?._id}-${index}`}>
              <td align="center">
                <input
                  type="checkbox"
                  checked={selectedItems[item.product?._id] || false}
                  onChange={() =>
                    setSelectedItems((p) => ({
                      ...p,
                      [item.product._id]: !p[item.product._id],
                    }))
                  }
                />
              </td>

              <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <img
                  src={getImageUrl(item.product)}
                  alt={item.product?.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: 5 }}
                />
                {item.product?.name}
              </td>

              <td align="center">${item.product?.price || 0}</td>

              <td align="center">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  disabled={updating}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product._id,
                      Number(e.target.value)
                    )
                  }
                  style={{ width: 60 }}
                />
              </td>

              <td align="center">
                ${(item.product?.price || 0) * item.quantity}
              </td>

              <td align="center">
                <button
                  onClick={() => handleRemove(item.product._id)}
                  disabled={updating}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <h3>Total (Selected): ${totalAmount}</h3>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={handleClearCart}
            disabled={updating}
            style={{
              padding: "10px 16px",
              background: "#555",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            Clear Cart
          </button>

          <button
            onClick={handleBuyNow}
            disabled={updating || totalAmount === 0}
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
