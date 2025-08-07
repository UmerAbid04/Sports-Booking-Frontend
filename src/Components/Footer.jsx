import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Side */}
        <div className="footer-left">
          <h2 className="footer-logo">
            Sport<span className="highlight">Book</span>
          </h2>
          <p className="footer-tagline">
            Pakistan's leading sports venue booking platform. Find, Book, and
            Play at premium venues across the country.
          </p>

          <div className="footer-cities-box">
            <h4>Cities Available:</h4>
            <p className="cities-list">
              Lahore | Karachi | Islamabad | Peshawar | Quetta
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Phone: 0000-0000000</p>
            <p>Email: abc@gmail.com</p>
            <p>123 Sports Lane, Lahore, Pakistan</p>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Facebook</a> | <a href="#">Twitter</a> |{" "}
              <a href="#">Instagram</a> | <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 SportBook. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
