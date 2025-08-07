// src/components/homepage/Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { motion } from "framer-motion";
import "./../../styles/Hero.css";
import { useMotionValue, useSpring, useTransform, animate } from "framer-motion";

const StatNumber = ({ target, className }) => {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);
  const endValue = parseInt(target.replace(/\D/g, ""));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const controls = animate(0, endValue, {
            duration: 3,
            onUpdate: (latest) => {
              setDisplayValue(Math.floor(latest).toLocaleString());
            },
          });

          return () => controls.stop();
        }
      },
      { threshold: 0.6 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [endValue]);

  return (
    <motion.div
      ref={ref}
      className={`hero-stat-value ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {displayValue}+
    </motion.div>
  );
};

const Hero = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (location) params.append("location", location);
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient-overlay" />
        <img
          src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Sports venue"
          className="hero-bg-image"
        />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="hero-inner">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Find & Book
            <span className="hero-highlight"> Sports Venues </span>
            <span className="hero-subtitle">Instantly</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Discover and book premium sports venues across the city. From padel courts to cricket grounds,
            find the perfect space for your game.
          </motion.p>

          <motion.div
            className="hero-search-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="hero-search-grid">
              <div className="hero-search-group">
                <div className="hero-search-input-wrapper">
                  <Search className="hero-icon" />
                  <input
                    type="text"
                    placeholder="Search sports, venues, companies..."
                    className="hero-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="hero-search-group">
                <div className="hero-select-wrapper">
                  <MapPin className="hero-icon" />
                  <select
                    className="hero-select"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Location</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
              </div>
              <div className="hero-search-group">
                <motion.button
                  className="hero-search-button"
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-stats-grid"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="hero-stat">
              <StatNumber target="500+" className="cyan" />
              <div className="hero-stat-label">Venues</div>
            </div>
            <div className="hero-stat">
              <StatNumber target="50+" className="blue" />
              <div className="hero-stat-label">Sports</div>
            </div>
            <div className="hero-stat">
              <StatNumber target="1000+" className="green" />
              <div className="hero-stat-label">Bookings</div>
            </div>
            <div className="hero-stat">
              <StatNumber target="25+" className="purple" />
              <div className="hero-stat-label">Cities</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
