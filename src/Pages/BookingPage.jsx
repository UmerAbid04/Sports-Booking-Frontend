import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosinstance";
import "../styles/BookingPage.css";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const queryFromURL = params.get("query");
  const locationFromURL = params.get("location");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [grounds, setGrounds] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const cities = ["Islamabad", "Lahore", "Karachi", "Rawalpindi"];
  const sports = ["Cricket", "Football", "Tennis", "Badminton", "Basketball"];

  const today = new Date();
  const in14Days = new Date();
  in14Days.setDate(today.getDate() + 14);

  const formatDate = (d) => d.toISOString().split("T")[0];

  // Inside JSX
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    min={formatDate(today)}
    max={formatDate(in14Days)}
  />;

  useEffect(() => {
    if (locationFromURL) setSelectedCity(locationFromURL);
    if (queryFromURL) {
      const match = sports.find(
        (sport) => sport.toLowerCase() === queryFromURL.toLowerCase()
      );
      if (match) setSelectedSport(match);
    }
  }, [locationFromURL, queryFromURL]);

  useEffect(() => {
    const fetchGroundsWithSlots = async () => {
      if (!selectedCity || !selectedSport || !selectedDate) {
        setGrounds([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://renderbackend-g73i.onrender.com/api/grounds/with-slots`,
          {
            params: {
              city: selectedCity,
              sportName: selectedSport,
              date: selectedDate,
            },
          }
        );
        if (Array.isArray(response.data)) setGrounds(response.data);
        else setGrounds([]);
      } catch (error) {
        console.error("Error fetching grounds:", error);
        setGrounds([]);
      }
    };

    fetchGroundsWithSlots();
  }, [selectedCity, selectedSport, selectedDate]);

  const handleAddToCart = (ground, slot) => {
    if (cart.length >= 1) {
      alert(
        "Only 1 slot can be added into the cart. If you want more slots, please make a separate booking."
      );
      return;
    }
    const booking = {
      venue: ground.name,
      city: ground.location?.city,
      sport: selectedSport,
      date: selectedDate,
      time: `${slot.startTime} - ${slot.endTime}`,
      price: slot.pricePerSlot || slot.price || 0,
      slotId: slot._id, // Add slot ID for booking creation
      groundId: ground._id, // Add ground ID for booking creation
      companyId: ground.company?._id || "UnknownCompanyId", // add this
      companyName: ground.company?.companyName || "Unknown Company", // add this
      company: ground.company?._id || null,
    };
    setCart([booking]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/guest-booking", {
        state: { cart }, // pass current cart to guest booking page
      });
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Create booking for the latest item in cart
      const latest = cart[cart.length - 1];

      const bookingResponse = await axios.post(
        "https://renderbackend-g73i.onrender.com/api/booking/user",
        {
          slotId: latest.slotId,
          specialRequests: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Booking created:", bookingResponse.data);
      const booking = bookingResponse.data.booking;

      // Get company name from backend response
      let companyName = "-";
      if (booking.company?.companyName) {
        companyName = booking.company.companyName;
      } else if (booking.ground?.company?.companyName) {
        companyName = booking.ground.company.companyName;
      }

      // Navigate to payment page with booking data
      navigate("/payment", {
        state: {
          bookingId: bookingResponse.data.booking._id,
          ground: latest.venue,
          company: companyName, // This should come from the booking response
          date: latest.date,
          time: latest.time,
          amount: latest.price, // Use the individual item price, not totalPrice
          location: latest.city + " Sports Complex",
        },
      });
    } catch (error) {
      console.error("Booking creation error:", error);
      if (error.response?.status === 409) {
        alert("This slot has already been booked. Please select another slot.");
      } else if (error.response?.status === 404) {
        alert("Slot not found. Please try again.");
      } else {
        alert("Failed to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-wrapper">
      <div className="booking-flow">
        <div className="card">
          <h2>Select a City</h2>
          <div className="button-group">
            {cities.map((city) => (
              <button
                key={city}
                className={selectedCity === city ? "active" : ""}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Select a Sport</h2>
          <div className="button-group">
            {sports.map((sport) => (
              <button
                key={sport}
                className={selectedSport === sport ? "active" : ""}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Select a Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={formatDate(today)}
            max={formatDate(in14Days)}
          />
        </div>

        {selectedCity && selectedSport && selectedDate && (
          <>
            <h2 className="section-heading">Available Venues</h2>
            <div className="venue-grid">
              {grounds.length === 0 && <p>No venues found.</p>}
              {grounds.map((ground) => (
                <div key={ground._id} className="venue-card">
                  <h3>{ground.name}</h3>
                  <p>
                    <strong>City:</strong> {ground.location?.city || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {ground.location?.address || "-"}
                  </p>
                  <p>
                    <strong>Sport:</strong>{" "}
                    {ground.sport?.name || selectedSport}
                  </p>

                  <h4>Time Slots</h4>
                  <div className="slots">
                    {ground.slots && ground.slots.length > 0 ? (
                      ground.slots.map((slot) => {
                        const isBooked = slot.isActive === false;
                        const isSelected = cart.some(
                          (item) =>
                            item.time ===
                              `${slot.startTime} - ${slot.endTime}` &&
                            item.date === selectedDate
                        );

                        return (
                          <button
                            key={slot._id}
                            className={`slot-button ${
                              isBooked
                                ? "inactive-slot"
                                : isSelected
                                ? "selected-slot"
                                : ""
                            }`}
                            onClick={() => {
                              if (isBooked) return;
                              handleAddToCart(ground, slot);
                            }}
                            disabled={isBooked || isSelected}
                          >
                            {slot.startTime} - {slot.endTime} (Rs{" "}
                            {slot.pricePerSlot || slot.price || 0})
                          </button>
                        );
                      })
                    ) : (
                      <p>No slots available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="cart-panel">
        <h2>🛒 My Cart</h2>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index}>
                <div>
                  <strong>{item.venue}</strong>
                  <br />
                  {item.sport} - {item.time}
                  <br />
                  Date: {item.date}
                  <br />
                  Rs {item.price}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(index)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: Rs {totalPrice}</h3>
        <button
          className="checkout-btn2"
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
