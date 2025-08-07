import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/ExploreByCategory.css";
import { motion } from "framer-motion";
import {
  Zap,
  Target,
  Users,
  Waves,
  Mountain,
  Trophy,
  Home,
  Sun,
  Moon,
} from "lucide-react";

const ExploreByCategory = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Section scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const categories = [
    {
      id: 1,
      name: "Padel",
      icon: Target,
      count: "120+ venues",
      image: "https://manual.co.id/wp-content/uploads/2025/02/5_padel_1-980x719.jpg",
      gradientClass: "gradient-orange-red",
      popular: true,
    },
    {
      id: 2,
      name: "Cricket",
      icon: Trophy,
      count: "85+ venues",
      image: "https://cdn.britannica.com/47/148847-050-C4FB5341/Cricket-bat-ball.jpg",
      gradientClass: "gradient-green-emerald",
      popular: true,
    },
    {
      id: 3,
      name: "Badminton",
      icon: Zap,
      count: "200+ venues",
      image: "https://www.racquetpoint.com/cdn/shop/articles/badminton-the-ultimate-guide-to-the-racquet-sport-460186.jpg?v=1741601376&width=2048",
      gradientClass: "gradient-blue-purple",
      popular: false,
    },
    {
      id: 4,
      name: "Football",
      icon: Users,
      count: "150+ venues",
      image: "https://cdn.britannica.com/51/190751-050-147B93F7/soccer-ball-goal.jpg",
      gradientClass: "gradient-cyan-blue",
      popular: true,
    },
    {
      id: 5,
      name: "Swimming",
      icon: Waves,
      count: "45+ venues",
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400",
      gradientClass: "gradient-teal-cyan",
      popular: false,
    },
    {
      id: 6,
      name: "Tennis",
      icon: Mountain,
      count: "90+ venues",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400",
      gradientClass: "gradient-purple-pink",
      popular: false,
    },
  ];

  const filters = [
    { id: "indoor", name: "Indoor", icon: Home, count: "300+" },
    { id: "outdoor", name: "Outdoor", icon: Sun, count: "250+" },
    { id: "night", name: "Night Games", icon: Moon, count: "180+" },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category?sport=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="explore-section" ref={sectionRef}>
      <div className="explore-container">
        <div className="explore-heading">
          <h2 className="explore-title">
            Explore by <span className="category">Category</span>
          </h2>
          <p className="explore-subtitles">
            Find the perfect venue for your favorite sport or discover something new.
          </p>
        </div>

        <div className="explore-filters">
          {filters.map((filter) => (
            <button key={filter.id} className="filter-button">
              <filter.icon className="filter-icon" />
              <span className="filter-name">{filter.name}</span>
              <span className="filter-count">({filter.count})</span>
            </button>
          ))}
        </div>

        <div className="category-grid">
          {categories.map((category, index) => {
            const Card = isMobile ? "div" : motion.div;
            return (
              <Card
                key={category.id}
                className={`category-card ${category.gradientClass}`}
                onClick={() => handleCategoryClick(category.name)}
                {...(!isMobile && {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: inView ? { opacity: 1, scale: 1 } : {},
                  transition: {
                    duration: 0.6,
                    delay: inView ? index * 0.1 : 0,
                    ease: "easeOut",
                  },
                })}
              >
                <div className="category-background">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-gradient" />
                </div>

                <div className="category-content">
                  <div className="category-header">
                    <div className="category-icon-wrapper">
                      <category.icon className="category-icon" />
                    </div>
                    {category.popular && (
                      <div className="popular-badge">
                        <span>POPULAR</span>
                      </div>
                    )}
                  </div>
                  <div className="category-footer">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-count">{category.count}</p>
                  </div>
                </div>

                <div className="hover-overlay" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreByCategory;
