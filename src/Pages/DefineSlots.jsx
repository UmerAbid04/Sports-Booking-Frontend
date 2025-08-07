import React, { useEffect, useState } from "react";
import axios from "../api/axiosinstance";
import "../styles/DefineSlots.css";
import { useLocation, useNavigate } from "react-router-dom";

const DefineSlots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const groundFromState = location.state?.ground?.ground;

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");
  const [price, setPrice] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [message, setMessage] = useState("");

  const weekdaysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (!groundFromState) {
      setMessage("❌ No ground data found. Redirecting...");
      setTimeout(() => navigate("/register-venue"), 2500);
    }
  }, [groundFromState, navigate]);

  const handleCheckboxChange = (day) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setMessage("❌ Please log in.");
      return;
    }

    const groundId = groundFromState?._id;
    if (!groundId) {
      setMessage("❌ Ground ID missing. Cannot define slots.");
      return;
    }

    if (
      !startTime ||
      !endTime ||
      !slotDuration ||
      !price ||
      selectedWeekdays.length === 0
    ) {
      setMessage("⚠️ Please fill all fields and select at least one weekday.");
      return;
    }

    try {
      const payload = {
        groundId,
        startTime,
        endTime,
        slotDurationMinutes: parseInt(slotDuration),
        pricePerSlot: parseInt(price),
        weekdays: selectedWeekdays,
      };

      console.log("📦 Sending payload:", payload);

      const response = await axios.post("/api/slot-template", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Slot template created:", response.data);
      setMessage("✅ Slot template created successfully!");
    } catch (error) {
      console.error("❌ Slot template error:", error);
      const errorMsg =
        error.response?.data?.message || "❌ Failed to create slot template.";
      setMessage(errorMsg);
    }
  };

  if (!groundFromState) {
    return (
      <div className="define-slots-container">
        ⚠️ No ground data found. Redirecting...
      </div>
    );
  }

  return (
    <div className="define-slots-container">
      <h2>
        Define Slots for{" "}
        <span className="highlight">{groundFromState.name}</span>
      </h2>

      <form className="slot-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Slot Duration (minutes):</label>
          <input
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            min="15"
            required
          />
        </div>

        <div className="form-group">
          <label>Price per Slot (PKR):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Weekdays:</label>
          <div className="weekday-checkboxes">
            {weekdaysList.map((day) => (
              <label key={day} className="weekday-option">
                <input
                  type="checkbox"
                  checked={selectedWeekdays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Create Slots
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default DefineSlots;
