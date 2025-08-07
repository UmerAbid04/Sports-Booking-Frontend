// src/components/homepage/FeaturedCarousel.jsx
import React, { useState, useEffect } from "react";
import "./../../styles/FeaturedCarousel.css";

import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      type: "competition",
      title: "Padel Championship 2024",
      subtitle: "Join the biggest padel tournament of the year",
      image: "https://images.pexels.com/photos/8007513/pexels-photo-8007513.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "March 15-20, 2024",
      location: "Elite Sports Complex, Lahore",
      participants: "128 Players",
      gradientClass: "gradient-orange-red",
    },
    {
      id: 2,
      type: "venue",
      title: "New Premium Cricket Ground",
      subtitle: "State-of-the-art facilities now available",
      image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "Now Open",
      location: "Sports City, Karachi",
      participants: "Book Now",
      gradientClass: "gradient-green-emerald",
    },
    {
      id: 3,
      type: "competition",
      title: "Badminton League Finals",
      subtitle: "Watch the best players compete",
      image: "https://images.pexels.com/photos/8007616/pexels-photo-8007616.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "April 5, 2024",
      location: "Metro Sports Arena, Islamabad",
      participants: "16 Teams",
      gradientClass: "gradient-blue-purple",
    },
    {
      id: 4,
      type: "venue",
      title: "Indoor Football Complex",
      subtitle: "Premium 5-a-side football courts",
      image: "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800",
      date: "Available 24/7",
      location: "Central District, Lahore",
      participants: "Multiple Courts",
      gradientClass: "gradient-cyan-blue",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        {/* Header */}
        <div className="carousel-heading">
          <h2 className="carousel-title">
            What's <span className="highlighted-text">Happening</span>
          </h2>
          <p className="carousel-subtitle">
            Stay updated with the latest competitions, new venues, and exciting events
          </p>
        </div>

        {/* Carousel */}
        <div className="carousel-wrapper">
          <div className="carousel-slider">
            <div
              className="slide-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="slide-wrapper">
                  <div className="slide-image-container">
                    <img src={slide.image} alt={slide.title} className="slide-image" loading="lazy" />
                    <div className={`slide-gradient ${slide.gradientClass}`} />
                    <div className="slide-content">
                      {/* Badge */}
                      <div className="slide-badge">
                        <Trophy className="badge-icon" />
                        <span className="badge-text">{slide.type}</span>
                      </div>

                      <h3 className="slide-title">{slide.title}</h3>
                      <p className="slide-subtitle">{slide.subtitle}</p>

                      {/* Info Cards */}
                      <div className="slide-info-grid">
                        <InfoCard icon={<Calendar />} label={slide.date} />
                        <InfoCard icon={<MapPin />} label={slide.location} />
                        <InfoCard icon={<Users />} label={slide.participants} />
                      </div>

                      <button className="slide-button">
                        {slide.type === "competition" ? "Register Now" : "Book Venue"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav Buttons */}
          <button onClick={prevSlide} className="nav-button left" aria-label="Previous Slide">
            <ChevronLeft />
          </button>
          <button onClick={nextSlide} className="nav-button right" aria-label="Next Slide">
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoCard = ({ icon, label }) => (
  <div className="info-card">
    <div className="info-icon">{icon}</div>
    <div className="info-label">{label}</div>
  </div>
);

export default FeaturedCarousel;
