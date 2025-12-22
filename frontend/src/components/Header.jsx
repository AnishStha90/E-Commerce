import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/custom.css";
import {
  FaHeart, FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt,
  FaSearch, FaBell, FaEnvelope, FaComments, FaTimes
} from "react-icons/fa";
import ChatBox from "../pages/Message/ChatBox";
import MessageCenter from "../pages/Message/MessageCenter";
import { getMessages, createMessage } from "../api/messageApi";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  useEffect(() => {
    if (chatOpen && isLoggedIn) {
      setLoadingMessages(true);
      getMessages()
        .then(msgs => setChatMessages(msgs))
        .catch(() => alert("Failed to load messages"))
        .finally(() => setLoadingMessages(false));
    }
  }, [chatOpen, isLoggedIn]);

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    logout();
    setChatOpen(false);
    navigate("/");
  };
  const handleSearch = () => alert(`Searching for: ${searchQuery}`);
  const handleSendMessage = async (text) => {
    try {
      const newMsg = await createMessage("support", text);
      setChatMessages(prev => [...prev, newMsg]);
    } catch {
      alert("Failed to send message");
    }
  };

  return (
    <header className="header">
      {/* Top Nav */}
      <div className="topNav">
        <ul className="navList">
          <li><button onClick={() => navigate("/")} className="linkButton">Home</button></li>
          <li><button onClick={() => navigate("/about")} className="linkButton">About</button></li>
          <li><button onClick={() => navigate("/product")} className="linkButton">Product</button></li>
        </ul>

        <ul className="navIcons">
          <li>
            <button onClick={() => navigate("/notifications")} title="Notifications" className="iconButton">
              <FaBell />
            </button>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <button onClick={() => navigate("/messages")} title="Messages" className="iconButton">
                  <FaEnvelope />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  title={chatOpen ? "Close Chat" : "Open Chat"}
                  className="iconButton"
                  style={{ fontSize: "18px" }}
                >
                  {chatOpen ? <FaTimes /> : <FaComments />}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/wishlist")}
                  title="Wishlist"
                  className="iconButton"
                >
                  <FaHeart />
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/carts")} title="Cart" className="iconButton">
                  <FaShoppingCart />
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/profile")} title="Profile" className="iconButton">
                  <FaUser />
                </button>
              </li>
              <li>
                <button onClick={handleLogout} title="Logout" className="iconButton">
                  <FaSignOutAlt />
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogin} title="Login" className="iconButton">
                <FaSignInAlt />
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Search Bar */}
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="searchBtn"><FaSearch /></button>
      </div>

      {/* Chat Box */}
      {chatOpen && (
        <div style={chatBoxStyles.overlay}>
          <div style={chatBoxStyles.chatContainer}>
            <h3>Chat with Support</h3>
            {loadingMessages ? (
              <p>Loading messages...</p>
            ) : (
              <MessageCenter messages={chatMessages} />
            )}
            <ChatBox onSend={handleSendMessage} />
          </div>
        </div>
      )}
    </header>
  );
}

const chatBoxStyles = {
  overlay: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "320px",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column"
  },
  chatContainer: { display: "flex", flexDirection: "column", height: "400px", padding: "10px" }
};

export default Header;
