import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, ArrowRight, Star } from "lucide-react";
import "./../../styles/WhatsNew.css";

const WhatsNew = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewestVenues = async () => {
      try {
        const res = await axios.get("https://renderbackend-g73i.onrender.com/api/grounds/newest");


        setVenues(res.data.newestGrounds || []);
      } catch (err) {
        console.error("Error fetching newest venues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewestVenues();
  }, []);

  return (
    <section className="whats-new-section">
      <div className="container">
        <div className="header">
          <h2>
            What's <span className="highlight">New</span>
          </h2>
          <p>Check out the latest venues added to our platform!</p>
        </div>

        {loading ? (
          <p>Loading latest venues...</p>
        ) : (
          <div className="news-grid">
            {venues.map((venue, index) => (
              <div
                key={venue._id}
                className={`news-card blue-cyan ${
                  index === 0 ? "span-two" : ""
                }`}
              >
                <img
                  src="https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt={venue.name}
                  className="news-bg"
                />
                <div className="overlay" />
                <div className="news-content">
                  <div className="news-top">
                    <div className="icon-box">
                      <Building2 className="icon" />
                    </div>
                    <div>
                      <span className="type">Venue</span>
                      <span className="date">
                        {new Date(venue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="badge">NEW</div>
                  </div>
                  <h3>{venue.name}</h3>
                  <p className="sports-offered">
  <strong>Sport:</strong> {venue.sport?.name}
</p>

                  <p>
                    {venue.location?.city}, {venue.location?.area}
                  </p>
                  <div className="rating">
                    <Star size={16} color="#ffc107" fill="#ffc107" />
                    <span>4.5</span>{" "}
                    {/* Replace with real avgRating if available */}
                  </div>
                  <button className="learn-more">
                    Learn More <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatsNew;