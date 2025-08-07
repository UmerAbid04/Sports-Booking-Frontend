// src/pages/CityVenuesPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import "../styles/CityVenuePage.css";

const CityVenuesPage = () => {
  const { cityName } = useParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenuesByCity = async () => {
      try {
        const res = await axiosInstance.get("/api/grounds/by-city", {
          params: { city: cityName },
        });

        setVenues(res.data.venues || []);
      } catch (error) {
        console.error("Error fetching venues by city:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cityName) {
      fetchVenuesByCity();
    }
  }, [cityName]);

  return (
    <div className="city-venues-wrapper">
      <h2 className="city-heading">
        {cityName === "all" ? "All Venues" : `Venues in ${cityName}`}
      </h2>

      {loading ? (
        <p>Loading venues...</p>
      ) : venues.length === 0 ? (
        <p>No venues registered in this city yet.</p>
      ) : (
        <div className="venue-card-grid">
          {venues.map((venue) => (
            <div key={venue._id} className="venue-card">
              <img
                src={venue.image || "/images/placeholder.jpg"}
                alt={venue.name}
                className="venue-img"
              />
              <h3>{venue.name}</h3>
              <p>
                <strong>Sport:</strong> {venue.sport?.name || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {venue.location?.address || "No address provided"}
              </p>
              {venue.location?.mapLink && (
                <iframe
                  src={venue.location.mapLink}
                  title={`Map of ${venue.name}`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "8px" }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityVenuesPage;
