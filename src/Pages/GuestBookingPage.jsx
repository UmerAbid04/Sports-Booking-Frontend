import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosinstance";
import "../styles/GuestBookingPage.css";

const GuestBookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handleGuestBooking = async () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      alert("Please fill all fields.");
      return;
    }

    if (cart.length === 0) {
      alert("No booking found.");
      return;
    }

    setLoading(true);

    try {
      const latest = cart[cart.length - 1];

      console.log("Guest booking payload:", {
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        slotId: latest.slotId,
        groundId: latest.groundId,
        date: latest.date,
      });

      const bookingResponse = await axios.post(
        "https://renderbackend-g73i.onrender.com/api/booking/guest",
        {
          name: guestInfo.name,
          email: guestInfo.email,
          phone: guestInfo.phone,
          slotId: latest.slotId,
          slot: latest.slotId,
          groundId: latest.groundId,
          date: latest.date,
        }
      );

      const booking = bookingResponse.data.booking;

      // Use cart’s company name if available
      const companyName = latest.company || "Unknown Company";

      navigate("/payment", {
        state: {
          bookingId: booking._id,
          ground: latest.venue,
          company: companyName,
          date: latest.date,
          time: latest.time,
          amount: latest.price,
          location: latest.city + " Sports Complex",
        },
      });
    } catch (error) {
      console.error(
        "Guest booking error:",
        error.response?.data || error.message
      );
      alert("Failed to create booking as guest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-booking-wrapper">
      <div className="guest-booking-card">
        <h2 className="guest-booking-title">Book as Guest</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={guestInfo.name}
          onChange={handleChange}
          className="guest-booking-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={guestInfo.email}
          onChange={handleChange}
          className="guest-booking-input"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={guestInfo.phone}
          onChange={handleChange}
          className="guest-booking-input"
        />
        <button
          onClick={handleGuestBooking}
          disabled={loading}
          className="guest-booking-btn"
        >
          {loading ? "Booking..." : "Book as Guest"}
        </button>
      </div>
    </div>
  );
};

export default GuestBookingPage;
