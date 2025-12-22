import React, { useEffect } from "react";
import "../../assets/styles/about.css";
import {
  FaCheckCircle,
  FaShippingFast,
  FaHeadset,
  FaLock
} from "react-icons/fa";

function AboutPage() {

  useEffect(() => {
    // Example: checking if a user token exists in localStorage
    const user = localStorage.getItem("user"); // or "token" if you store JWT
    if (user) {
      console.log("User is logged in:", JSON.parse(user));
    } else {
      console.log("User is not logged in");
    }
  }, []);

  return (
    <div className="aboutPage">
      {/* Hero Section */}
      <section className="aboutHero">
        <h1>About ShopEase</h1>
        <p>Your trusted destination for quality gadgets and electronics.</p>
      </section>

      {/* Our Mission */}
      <section className="aboutSection">
        <h2>Our Mission</h2>
        <p>
          At <strong>ShopEase</strong>, we aim to deliver the best online shopping experience
          for modern tech lovers. From trending electronics to everyday gadgets, our goal is to
          offer products that meet your needs with unbeatable service and fast delivery.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="aboutSection">
        <h2>Why Choose ShopEase?</h2>
        <ul className="aboutFeatures">
          <li>
            <FaCheckCircle className="featureIcon" />
            <span><strong> Quality Products:</strong> We hand-pick only the best items from trusted vendors.</span>
          </li>
          <li>
            <FaShippingFast className="featureIcon" />
            <span><strong> Fast Delivery:</strong> Quick and reliable shipping across the country.</span>
          </li>
          <li>
            <FaHeadset className="featureIcon" />
            <span><strong> 24/7 Support:</strong> Our support team is always ready to help you.</span>
          </li>
          <li>
            <FaLock className="featureIcon" />
            <span><strong> Secure Payments:</strong> Your transactions are safe and encrypted.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
