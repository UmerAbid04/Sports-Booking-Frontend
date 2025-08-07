// src/components/homepage/Locations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Clock,
  Star,
  Users,
  ArrowRight,
  Wifi,
  Car,
  Coffee,
} from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import "./../../styles/Locations.css";

const getAmenityIcon = (amenity) => {
  switch (amenity.toLowerCase()) {
    case "parking":
    case "car":
      return Car;
    case "wifi":
      return Wifi;
    case "cafeteria":
    case "canteen":
    case "restaurant":
      return Coffee;
    default:
      return Users;
  }
};

const AnimatedCounter = ({ to, suffix = "" }) => {
  const ref = React.useRef();
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: 1.5,
      onUpdate: (latest) => setValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [isInView, to]);

  return (
    <div ref={ref}>
      {value}
      {suffix}
    </div>
  );
};

const Locations = () => {
  const [featuredLocations, setFeaturedLocations] = useState([]);

  useEffect(() => {
    const filters = [
      { city: "Lahore", sportName: "Football" },
      { city: "Karachi", sportName: "Cricket" },
      { city: "Islamabad", sportName: "Basketball" },
      { city: "Lahore", sportName: "Badminton" },
      { city: "Karachi", sportName: "Tennis" },
    ];

    const fetchRandomVenues = async () => {
      try {
        const responses = await Promise.all(
          filters.map(({ city, sportName }) =>
            axios.get("https://renderbackend-g73i.onrender.com/api/grounds/by-city", {
              params: { city, sportName },
            })
          )
        );

        const allGrounds = responses.flatMap(res => res.data.venues || []);
        const uniqueGrounds = Array.from(
          new Map(allGrounds.map(g => [g._id, g])).values()
        );
        const shuffled = uniqueGrounds.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        const formatted = selected.map((g) => ({
          id: g._id,
          name: g.name || "Unnamed Ground",
          city: g.location?.city || "Unknown City",
          address: g.location?.address || "Unknown Address",
          rating: g.rating ? parseFloat(g.rating.toFixed(1)) : 4.0,
          reviews: g.reviewsCount || 0,
          image: g.image || "https://placehold.co/400x250?text=No+Image",
          sports: [g.sport?.name || "Sport"],
          amenities: g.amenities || [],
          openHours: g.openHours || "9:00 AM - 10:00 PM",
          priceRange: `₨ ${g.pricePerHour || 2000} per hour`,
          company: g.company?.name || "Unknown Company",
        }));

        setFeaturedLocations(formatted);
      } catch (err) {
        console.error("Error fetching random venues:", err);
      }
    };

    fetchRandomVenues();
  }, []);

  return (
    <section className="locations-section">
      <div className="locations-container">
        <motion.div
          className="locations-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>
            Featured <span className="highlight-text">Locations</span>
          </h2>
          <p>Discover premium sports venues with top-notch facilities across Pakistan</p>
        </motion.div>

        {featuredLocations.length === 0 ? (
          <p className="empty-text">No featured venues found.</p>
        ) : (
          <motion.div
            className="locations-grid"
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {featuredLocations.map((location) => (
              <motion.div
                key={location.id}
                className="location-card"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="location-image-container">
                  {location.image.includes("placehold.co") ? (
                    <div className="location-placeholder">
                      <span>{location.name}</span>
                    </div>
                  ) : (
                    <img src={location.image} alt={location.name} className="location-image" />
                  )}
                  <div className="location-overlay" />
                  <div className="featured-badge">FEATURED</div>
                  <div className="rating-badge">
                    <Star className="icon yellow" />
                    <span>{location.rating}</span>
                  </div>
                  <div className="location-city">
                    <MapPin className="icon small" />
                    <span>{location.city}</span>
                  </div>
                </div>

                <div className="location-content">
                  <h3>{location.name}</h3>
                  <p className="address">{location.address}</p>

                  <div className="sports-tags">
                    {location.sports.slice(0, 3).map((sport, i) => (
                      <span key={i} className="sport-tag sport-color">
                        {sport}
                      </span>
                    ))}
                  </div>

                  <div className="amenities">
                    {location.amenities.slice(0, 3).map((amenity, i) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div key={i} className="amenity-item">
                          <Icon className="icon small gray" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="location-info">
                    <div className="info-line">
                      <Clock className="icon small gray" />
                      <span>{location.openHours}</span>
                    </div>
                    <div className="info-line">
                      <span>Price Range:</span>
                      <span className="text-cyan">{location.priceRange}</span>
                    </div>
                    <div className="info-line">
                      <span>Reviews:</span>
                      <span>{location.reviews} reviews</span>
                    </div>
                  </div>

                  <button className="view-btn">
                    <span>View Details</span>
                    <ArrowRight className="icon arrow" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="location-stats">
          <div>
            <h3><AnimatedCounter to={featuredLocations.length} /></h3>
            <p>Total Featured Venues</p>
          </div>
          <div>
            <h3><AnimatedCounter to={5} /></h3>
            <p>Cities Searched</p>
          </div>
          <div>
            <h3><AnimatedCounter to={2000} suffix="+ PKR" /></h3>
            <p>Avg Hourly Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
