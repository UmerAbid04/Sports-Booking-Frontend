import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import supabase from '../supabaseClient';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setIsLoggedIn(!!(token && user));
    setRole(user?.role || null);
  }, [location]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      const input = searchInput.toLowerCase();
      const cities = ["karachi", "lahore", "islamabad"];
      const sports = ["basketball", "swimming", "cricket", "paddle tennis", "tennis", "soccer"];
      const foundCity = cities.find((city) => input.includes(city));
      const foundSport = sports.find((sport) => input.includes(sport));
      const queryParams = new URLSearchParams();
      if (foundSport) queryParams.append("query", foundSport);
      if (foundCity) queryParams.append("location", foundCity);
      if (queryParams.toString()) {
        navigate(`/booking?${queryParams.toString()}`);
      } else {
        alert("Please enter a valid sport or city");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-left">
        <motion.div
          className="logo"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="logo-icon">📘</span>
          <span className="logo-text">
            Sport<span className="logo-highlight">Book</span>
          </span>
        </motion.div>
        <div className="hamburger" onClick={toggleMenu}>☰</div>
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          {role !== "admin" && role !== "company" && (
            <>
              <li><a href="#venues" onClick={() => setMenuOpen(false)}>Venues</a></li>
              <li><a href="#sports" onClick={() => setMenuOpen(false)}>Sports</a></li>
              <li><a href="#whatsnew" onClick={() => setMenuOpen(false)}>Whats New</a></li>
              <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
              <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
            </>
          )}

          {isLoggedIn ? (
            <>
              <li className="mobile-only">
                <a onClick={() => {
                  setMenuOpen(false);
                  if (role === "admin") navigate("/admin-panel");
                  else if (role === "company") navigate("/company-dashboard");
                  else navigate("/account");
                }}>
                  {role === "admin" ? "Admin Panel" : role === "company" ? "Dashboard" : "Account Settings"}
                </a>
              </li>
              <li className="mobile-only">
                <a onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="mobile-only">
                <a onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}>
                  Login
                </a>
              </li>
              <li className="mobile-only">
                <a onClick={() => {
                  setMenuOpen(false);
                  navigate("/signup");
                }}>
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      {role !== "admin" && (
        <motion.div
          className="navbar-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="🔍 Search venues, sports, locations..."
            className="search-bar"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
          />
        </motion.div>
      )}

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <motion.button
              className="login-btn"
              onClick={() => {
                if (role === "admin") navigate("/admin-panel");
                else if (role === "company") navigate("/company-dashboard");
                else navigate("/account");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {role === "admin" ? "Admin Panel" : role === "company" ? "Dashboard" : "Account Settings"}
            </motion.button>
            <motion.button
              className="signup-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              className="login-btn"
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              className="signup-btn"
              onClick={() => navigate("/signup")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
