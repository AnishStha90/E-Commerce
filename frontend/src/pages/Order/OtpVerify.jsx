import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerify = ({ length = 6 }) => {
  const { orderId } = useParams(); // from URL
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // -------------------- VERIFY OTP --------------------
  const verifyOtp = async (otpValue) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `http://localhost:5000/api/orders/verify-otp/${orderId}`,
        { otp: otpValue }
      );

      setSuccess("OTP verified successfully ✅");

      // Redirect after success
      setTimeout(() => {
        navigate("/order-success");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP"
      );
      setOtp(Array(length).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // -------------------- INPUT HANDLERS --------------------
  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(Boolean)) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }

      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    const newOtp = Array(length)
      .fill("")
      .map((_, i) => pasted[i] || "");

    setOtp(newOtp);

    const lastIndex = Math.min(pasted.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();

    if (newOtp.every(Boolean)) {
      verifyOtp(newOtp.join(""));
    }
  };

  // -------------------- UI --------------------
  return (
    <>
      <style>{`
        .otp-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
        }

        .otp-box {
          background: white;
          padding: 28px;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          text-align: center;
          width: 100%;
          max-width: 380px;
        }

        .otp-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .otp-sub {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .otp-container {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .otp-input {
          width: 44px;
          height: 52px;
          border: 2px solid #d1d5db;
          border-radius: 10px;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
          outline: none;
          transition: 0.2s;
        }

        .otp-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
        }

        .otp-error {
          color: #dc2626;
          font-size: 0.85rem;
          margin-top: 10px;
        }

        .otp-success {
          color: #16a34a;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        .otp-loading {
          font-size: 0.9rem;
          color: #2563eb;
          margin-top: 10px;
        }
      `}</style>

      <div className="otp-wrapper">
        <div className="otp-box">
          <div className="otp-title">Verify OTP</div>
          <div className="otp-sub">
            Enter the OTP sent to your email
          </div>

          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                disabled={loading}
              />
            ))}
          </div>

          {loading && <div className="otp-loading">Verifying...</div>}
          {error && <div className="otp-error">{error}</div>}
          {success && <div className="otp-success">{success}</div>}
        </div>
      </div>
    </>
  );
};

export default OtpVerify;
