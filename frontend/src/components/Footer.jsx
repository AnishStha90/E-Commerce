import React from "react";
import "../assets/styles/custom.css"; // this is fine

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} My Website. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
