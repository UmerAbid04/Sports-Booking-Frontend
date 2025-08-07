import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "../api/axiosinstance";
import "../styles/NewVenueReg.css";

const sports = [
  { name: "Football", _id: "1" },
  { name: "Cricket", _id: "2" },
  { name: "Tennis", _id: "3" },
  { name: "Basketball", _id: "4" },
  { name: "Badminton", _id: "5" },
];

const VenueRegistration = () => {
  const navigate = useNavigate(); // ✅
  const [venueData, setVenueData] = useState({
    name: "",
    description: "",
    sportName: "",
    capacity: "",
    amenities: "",
    address: "",
    city: "",
  });

  const [message, setMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // ✅ Add this

  const handleChange = (e) => {
    setVenueData({
      ...venueData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/grounds/add",
        {
          ...venueData,
          capacity: parseInt(venueData.capacity),
          amenities: venueData.amenities.split(",").map((item) => item.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("New ground response:", response.data);

      setMessage("✅ Venue registered successfully!");
      setRegistrationSuccess(true);

      setVenueData({
        name: "",
        description: "",
        sportName: "",
        capacity: "",
        amenities: "",
        address: "",
        city: "",
      });

      // Get the entire new ground object returned by backend
      const newGround = response.data;

      // Navigate to Define Slots, passing the full ground object
      navigate("/define-slots", { state: { ground: newGround } });
    } catch (error) {
      console.error(
        "Error adding venue:",
        error.response?.data || error.message
      );
      setMessage("❌ Failed to register venue.");
    }
  };

  return (
    <div className="venue-form-container">
      <h2>Register New Venue</h2>
      <form onSubmit={handleSubmit} className="venue-form">
        <input
          type="text"
          name="name"
          placeholder="Venue Name"
          value={venueData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={venueData.description}
          onChange={handleChange}
          required
        />

        <select
          name="sportName"
          value={venueData.sportName}
          onChange={handleChange}
          required
        >
          <option value="">Select Sport</option>
          {sports.map((sport) => (
            <option key={sport._id} value={sport.name}>
              {sport.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={venueData.capacity}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={venueData.amenities}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={venueData.address}
          onChange={handleChange}
          required
        />

        <select
          name="city"
          value={venueData.city}
          onChange={handleChange}
          required
        >
          <option value="">Select City</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Rawalpindi">Rawalpindi</option>
        </select>

        <button type="submit">Register Venue</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default VenueRegistration;