import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkout } from "../../api/orderApi";
import { getUserProfile } from "../../api/userApi";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.items || !state.items.length) {
    return <p className="text-center mt-10">No items to checkout.</p>;
  }

  const { items, total } = state;
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    ward: "",
    street: "",
    municipality: "",
    district: "",
    province: "",
    country: "Nepal",
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processing, setProcessing] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);

        if (profile.address) {
          setShippingAddress({
            ward: profile.address.ward || "",
            street: profile.address.street || "",
            municipality: profile.address.municipality || "",
            district: profile.address.district || "",
            province: profile.address.province || "",
            country: profile.address.country || "Nepal",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  // -------------------- PLACE PRE-ORDER --------------------
  const handlePayment = async () => {
    if (!user || !user._id) {
      alert("Please login properly to place the order.");
      return;
    }

    const finalAddress = useNewAddress
      ? { ...shippingAddress }
      : user.address || {
          ward: "",
          street: "",
          municipality: "",
          district: "",
          province: "",
          country: "Nepal",
        };

    const missingFields = Object.entries(finalAddress)
      .filter(([_, val]) => !val || val.trim() === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      alert(`Please fill the required field(s): ${missingFields.join(", ")}`);
      return;
    }

    const orderItems = items.map((item) => ({
      product: typeof item.product === "string" ? item.product : item.product._id,
      quantity: Number(item.quantity || 1),
    }));

    setProcessing(true);
    try {
      const orderData = {
        address: finalAddress,
        items: orderItems,
        paymentMethod,
        preOrder: true, // flag for OTP-only order
      };

      const res = await checkout(user._id, orderData); // API returns orderId and sends OTP
      alert(`OTP sent to your email! Order ID: ${res.orderId}`);

      navigate(`/verify-otp/${res.orderId}`);
    } catch (err) {
      console.error("Pre-order error:", err);
      alert(err.response?.data?.message || "Failed to create order.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Payment</h2>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 border">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        <ul className="mb-4">
          {items.map((item) => (
            <li
              key={typeof item.product === "string" ? item.product : item.product._id}
              className="border-b py-2"
            >
              <strong>{item.product.name || item.product._id}</strong> x {item.quantity} = $
              {(item.product.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="font-bold">
          <strong>Payable Amount:</strong> ${total.toFixed(2)}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 border">
        <h3 className="text-2xl font-semibold mb-4">Shipping Address</h3>
        <p className="mb-2">
          <strong>Default Address:</strong>{" "}
          {user?.address
            ? `${user.address.ward}, ${user.address.street}, ${user.address.municipality}, ${user.address.district}, ${user.address.province}, ${user.address.country}`
            : "Not set"}
        </p>
        <button
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
          onClick={() => setUseNewAddress(!useNewAddress)}
        >
          {useNewAddress ? "Use Default Address" : "Enter New Address"}
        </button>

        {useNewAddress && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["ward", "street", "municipality", "district", "province", "country"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shippingAddress[field] || ""}
                  onChange={handleAddressChange}
                  className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-2xl font-semibold mb-4">Select Payment Method</h3>
        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            Online Payment
          </label>
        </div>
        <button
          onClick={handlePayment}
          disabled={processing}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md shadow transition"
        >
          {processing ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
