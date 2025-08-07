// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import "../styles/CategoryPage.css";

const CategoryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedSport = params.get("sport");

  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrounds = async () => {
      if (!selectedSport) {
        setError("No sport selected.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/api/grounds/by-sport?sportName=${encodeURIComponent(selectedSport)}`
        );

        const data = Array.isArray(response.data.venues)
          ? response.data.venues
          : [];

        setGrounds(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch grounds", err);
        setError(err.response?.data?.message || "Failed to load data.");
        setLoading(false);
      }
    };

    fetchGrounds();
  }, [selectedSport]);

  return (
    <div className="category-page">
      <h2 className="category-heading">
        {selectedSport ? `${selectedSport} Venues` : "All Sports Venues"}
      </h2>

      {loading ? (
        <p>Loading venues...</p>
      ) : error ? (
        <p>{error}</p>
      ) : grounds.length > 0 ? (
        <div className="venue-grid">
          {grounds.map((ground) => (
            <div key={ground._id} className="venue-card">
              <img
                src={ground.image || "/images/default.jpg"}
                alt={ground.name}
                className="venue-image"
              />
              <h3>{ground.name}</h3>
              <p>
                <strong>City:</strong> {ground.location?.city || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {ground.location?.address || "N/A"}
              </p>
              <div className="map-container">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    ground.location?.address || ""
                  )}&output=embed`}
                  title={`Map of ${ground.name}`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "8px" }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No venues found for {selectedSport}.</p>
      )}
    </div>
  );
};

export default CategoryPage;