import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/UserSetting.css";

const UserSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: "", comment: "" });

  const navigate = useNavigate();

  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          "https://renderbackend-g73i.onrender.com/api/user/update/my-bookings",
          {
            credentials: "include", // ✅ Enables cookies to be sent
          }
        );

        const data = await res.json();

        if (res.ok) {
          const formatted = data.bookings
            .filter((b) => b._id)
            .map((b) => {
              const formatTime = (timeStr) => {
                if (!timeStr) return "Not provided";
                const [hour, minute] = timeStr.split(":").map(Number);
                const date = new Date();
                date.setHours(hour);
                date.setMinutes(minute);
                return date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              };

              return {
                id: b._id,
                venue: b.ground?.name || "Unknown Ground",
                sport:
                  b.sport?.name || b.ground?.sport?.name || "Unknown Sport",
                date: b.slot?.date
                  ? new Date(b.slot.date).toISOString().split("T")[0]
                  : "Unknown Date",
                time: formatTime(b.slot?.startTime || b.slot?.time || null),
                price:
                  typeof b.totalAmount === "number"
                    ? `Rs ${b.totalAmount}`
                    : "Not specified",
                status: b.status || "pending",
                review: b.review || null,
              };
            });

          setBookings(formatted);
        } else {
          alert("Failed to load booking history.");
        }
      } catch (err) {
        console.error("Booking fetch error:", err);
        alert("An error occurred while fetching bookings.");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken"); // ✅ Correct key

      const res = await fetch(
        "https://renderbackend-g73i.onrender.com/api/user/update/update-profile",
        {
          method: "PUT",
          credentials: "include", // ✅ Add this
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name, email, isLoggedIn: true })
        );
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      alert("An error occurred while updating your profile.");
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Both old and new passwords are required.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        "https://renderbackend-g73i.onrender.com/api/user/update/change-password",
        {
          method: "PUT",
          credentials: "include", // ✅ Required
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      alert("An error occurred while changing the password.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Not authenticated. Please log in again.");
        return;
      }

      const res = await fetch(
        `https://renderbackend-g73i.onrender.com/api/user/cancel/${bookingId}`,
        {
          method: "PATCH", // <-- changed from PUT to PATCH
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();
      console.log("Raw server response:", text);

      const contentType = res.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = JSON.parse(text);
      } else {
        data = { message: "Server did not return JSON" };
      }

      if (res.ok) {
        alert("Booking cancelled successfully.");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b
          )
        );
      } else {
        alert(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("An error occurred while cancelling the booking.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken"); // ✅ Correct key

      const res = await fetch(
        "https://renderbackend-g73i.onrender.com/api/user/update/delete-account",
        {
          method: "DELETE",
          credentials: "include", // ✅ Required
        }
      );

      if (res.ok) {
        alert("Account deleted.");
        localStorage.clear();
        navigate("/signup");
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("An error occurred.");
    }
  };

  const handleToggleReview = (bookingId) => {
    if (expandedReviewId === bookingId) {
      setExpandedReviewId(null);
      setReviewData({ rating: "", comment: "" });
    } else {
      setExpandedReviewId(bookingId);
      setReviewData({ rating: "", comment: "" });
    }
  };

  const handleSubmitReview = async (bookingId) => {
    if (!reviewData.rating || !reviewData.comment.trim()) {
      alert("Please provide both rating and comment.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Not authenticated. Please log in again.");
      return;
    }

    try {
      const res = await fetch(
        "https://renderbackend-g73i.onrender.com/api/reviews",
        {
          method: "POST",
          credentials: "include", // Optional if backend uses cookies — keep for safety
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ SEND JWT
          },
          body: JSON.stringify({
            bookingId,
            rating: reviewData.rating,
            comment: reviewData.comment,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted!");
        const updated = bookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                review: {
                  rating: reviewData.rating,
                  comment: reviewData.comment,
                },
              }
            : b
        );
        setBookings(updated);
        setExpandedReviewId(null);
        setReviewData({ rating: "", comment: "" });
      } else {
        alert(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      alert("An error occurred while submitting the review.");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log(
      "Current logged in user:",
      JSON.parse(localStorage.getItem("currentUser"))
    );

    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  return (
    <div className="user-settings-container">
      <h2>User Settings</h2>

      <form onSubmit={handleUpdate} className="settings-form">
        <label>
          Email
          <input value={email} readOnly />
        </label>

        <label>
          Old Password
          <div className="password-input-wrapper">
            <input
              className="password-input"
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label>
          New Password
          <div className="password-input-wrapper">
            <input
              className="password-input"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          type="button"
          className="update-btn"
          onClick={handleChangePassword}
        >
          Change Password
        </button>

        <button type="submit" className="update-btn">
          Save Changes
        </button>
      </form>

      {/* Bookings Section */}
      <div className="booking-history">
        <h3>Booking History</h3>
        {bookings.length === 0 ? (
          <p>No past bookings found.</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id} className={`booking-card ${booking.status}`}>
                <strong>{booking.venue}</strong> <br />
                {booking.sport} – {booking.date} at {booking.time} <br />
                Rs {booking.price} <br />
                <span className={`status-label ${booking.status}`}>
                  Status: {booking.status}
                </span>
                {booking.status === "pending" && (
                  <button
                    className="cancel-booking-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                )}
                {booking.status === "played" && !booking.review && (
                  <button
                    className="review-btn"
                    onClick={() => handleToggleReview(booking.id)}
                  >
                    Give Review
                  </button>
                )}
                {expandedReviewId === booking.id && (
                  <div className="review-section">
                    <label>
                      Rating:
                      <select
                        value={reviewData.rating}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            rating: parseInt(e.target.value),
                          }))
                        }
                      >
                        <option value="">--</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} ⭐
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Comment:
                      <textarea
                        value={reviewData.comment}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Write your feedback..."
                      />
                    </label>

                    <div className="review-actions">
                      <button
                        className="submit-review-btn"
                        onClick={() => handleSubmitReview(booking.id)}
                      >
                        Submit
                      </button>

                      <button
                        className="cancel-review-btn"
                        onClick={() => setExpandedReviewId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {booking.review && (
                  <div className="submitted-review">
                    <p>
                      <strong>Your Review:</strong> {booking.review.rating} ⭐ –{" "}
                      {booking.review.comment}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="extra-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
