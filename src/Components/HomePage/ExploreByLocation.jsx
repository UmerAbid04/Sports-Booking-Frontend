import React, { useRef, useState, useEffect } from "react";
import { MapPin, Star } from "lucide-react";
import "./../../styles/ExploreByLocation.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ExploreByLocation = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const locations = [
    {
      id: 1,
      city: "Lahore",
      venues: 180,
      rating: 4.8,
      bookings: "12K+",
      image: "https://c.stocksy.com/a/dI9500/z9/1227391.jpg",
      gradientClass: "gradient-orange-red",
      popular: true,
    },
    {
      id: 2,
      city: "Karachi",
      venues: 220,
      rating: 4.7,
      bookings: "15K+",
      image: "https://media.istockphoto.com/id/157611973/photo/mausoleum-of-pakistans-founder-mohammad-ali-jinnah.jpg?s=612x612&w=0&k=20&c=2KTv7qBEs4kt6bMMEgkpwVRHTrnqQvc6s54GBPNH5p8=",
      gradientClass: "gradient-blue-cyan",
      popular: true,
    },
    {
      id: 3,
      city: "Islamabad",
      venues: 95,
      rating: 4.9,
      bookings: "8K+",
      image: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0a/c6/d5/4b.jpg",
      gradientClass: "gradient-green-emerald",
      popular: false,
    },
    {
      id: 4,
      city: "Faisalabad",
      venues: 65,
      rating: 4.6,
      bookings: "5K+",
      image: "https://pakistantourntravel.com/wp-content/uploads/2024/08/faisalabad.webp",
      gradientClass: "gradient-purple-pink",
      popular: false,
    },
    {
      id: 5,
      city: "Multan",
      venues: 45,
      rating: 4.5,
      bookings: "3K+",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCBAdeZIKMDXNedkN-JVPuixb--bDqk6AECnPhx9nLdFEEccgMzTkGPdncNtXLy-WQ-BQ&usqp=CAU",
      gradientClass: "gradient-teal-cyan",
      popular: false,
    },
    {
      id: 6,
      city: "Peshawar",
      venues: 35,
      rating: 4.4,
      bookings: "2K+",
      image: "https://www.laurewanders.com/wp-content/uploads/2024/09/Places-to-visit-in-Peshawar-04-1.jpg",
      gradientClass: "gradient-indigo-purple",
      popular: false,
    },
  ];

  const handleCityClick = (city) => {
    navigate(`/city/${encodeURIComponent(city)}`);
  };

  return (
    <div className="body">
      <section className="explore-location-section" ref={sectionRef}>
        <div className="explore-location-container">
          <div className="explore-location-heading">
            <h2 className="explore-location-title">
              Explore by <span className="location">Location</span>
            </h2>
            <p className="explore-location-subtitle">
              Discover amazing sports venues in cities across Pakistan
            </p>
          </div>

          <div className="location-grid">
            {locations.map((location, index) => {
              const Card = isMobile ? "div" : motion.div;
              return (
                <Card
                  key={location.id}
                  className={`location-card ${location.gradientClass}`}
                  onClick={() => handleCityClick(location.city)}
                  style={{ cursor: "pointer" }}
                  {...(!isMobile && {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: inView ? { opacity: 1, scale: 1 } : {},
                    transition: {
                      delay: inView ? index * 0.1 : 0,
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  })}
                >
                  <div className="location-bg">
                    <img
                      src={location.image}
                      alt={location.city}
                      className="location-img"
                    />
                    <div className="location-gradient" />
                  </div>

                  <div className="location-content">
                    <div className="location-top">
                      <div className="location-icon-wrapper">
                        <MapPin className="location-icon" />
                      </div>
                      {location.popular && (
                        <div className="popular-badge">
                          <span>POPULAR</span>
                        </div>
                      )}
                    </div>

                    <div className="location-bottom">
                      <h3 className="location-city">{location.city}</h3>
                      <div className="location-stats">
                        <div className="stats-box">
                          <div className="stats-value">{location.venues}</div>
                          <div className="stats-label">Venues</div>
                        </div>
                        <div className="stats-box">
                          <div className="stats-rating">
                            <Star className="star-icon" />
                            <span className="stats-value">{location.rating}</span>
                          </div>
                          <div className="stats-label">Rating</div>
                        </div>
                        <div className="stats-box">
                          <div className="stats-value">{location.bookings}</div>
                          <div className="stats-label">Bookings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExploreByLocation;
