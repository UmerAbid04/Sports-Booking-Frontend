import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosinstance";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaCog,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyDashboard.css";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [grounds, setGrounds] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    revenue: 0,
    grounds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      axiosInstance.get("/api/company/dashboard/grounds"),
      axiosInstance.get("/api/company/dashboard/bookings"),
      axiosInstance.get("/api/company/dashboard/total-bookings"),
      axiosInstance.get("/api/company/dashboard/upcoming-bookings"),
      axiosInstance.get("/api/company/dashboard/total-revenue"),
      axiosInstance.get("/api/company/dashboard/total-grounds"),
    ])
      .then(
        ([
          groundsRes,
          bookingsRes,
          totalBookingsRes,
          upcomingBookingsRes,
          revenueRes,
          totalGroundsRes,
        ]) => {
          setGrounds(groundsRes.data || []);
          setRecentBookings(bookingsRes.data || []);
          setStats({
            totalBookings: totalBookingsRes.data?.totalBookings || 0,
            revenue: revenueRes.data?.totalRevenue || 0,
            grounds: totalGroundsRes.data?.totalGrounds || 0,
          });
          setLoading(false);
        }
      )
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    try {
      const res = await axiosInstance.patch(
        `/api/company/bookings/confirm/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Booking confirmed successfully!");
      setRecentBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: "confirmed" }
            : booking
        )
      );
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await axiosInstance.delete(`/api/company/bookings/reject/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecentBookings((prev) =>
        prev.filter((booking) => booking.bookingId !== bookingId)
      );
      alert("Booking rejected successfully!");
    } catch (err) {
      console.error("Error rejecting booking:", err);
    }
  };

  // Filtered bookings before pagination
 const filteredBookings = recentBookings.filter((booking) => {
  const userName = booking.userName || "";
  const groundName = booking.groundName || "";
  const status = booking.status || "";

  const matchesSearch =
    userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groundName.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    status.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesStatus;
});


  // Pagination after filtering
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error)
    return <div className="dashboard-container error-container">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Company Dashboard</h1>
          <p className="dashboard-subtitle">Manage your sports facilities</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-icon-btn">
            <FaBell />
          </button>
          <button className="dashboard-icon-btn">
            <FaCog />
          </button>
          <div className="dashboard-avatar">AC</div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div>
            <div className="stat-title">Total Bookings</div>
            <div className="stat-value">{stats.totalBookings}</div>
          </div>
        </div>
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div>
            <div className="stat-title">Revenue</div>
            <div className="stat-value">₨{stats.revenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <FaMapMarkerAlt className="stat-icon" />
          <div>
            <div className="stat-title">Grounds</div>
            <div className="stat-value">{stats.grounds}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab${
            activeTab === "overview" ? " active" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`dashboard-tab${activeTab === "grounds" ? " active" : ""}`}
          onClick={() => setActiveTab("grounds")}
        >
          Grounds
        </button>
        <button
          className={`dashboard-tab${
            activeTab === "bookings" ? " active" : ""
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
      </div>

      <div className="dashboard-section">
        {activeTab === "overview" && (
          <div
            className="dashboard-overview-grid"
            style={{ gridTemplateColumns: "1fr" }}
          >
            <div className="dashboard-card">
              <h3>Recent Bookings</h3>
              <div className="dashboard-list">
                {[...recentBookings]
                  .reverse()
                  .slice(0, 5)
                  .map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="dashboard-list-item"
                    >
                      <div>
                        <div className="dashboard-list-title">
                          {booking.userName}
                        </div>
                        <div className="dashboard-list-sub">
                          {booking.groundName}
                        </div>
                      </div>
                      <div className="dashboard-list-right">
                        <div className="dashboard-list-date">
                          {new Date(booking.slotDate).toLocaleDateString()} —{" "}
                          {booking.startTime} to {booking.endTime}
                        </div>

                        {booking.status?.toLowerCase() ===
                        "pending-confirmation" ? (
                          <div className="booking-action-buttons">
                            <button
                              className="accept-btn"
                              onClick={() =>
                                handleConfirmBooking(booking.bookingId)
                              }
                            >
                              Confirm
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() =>
                                handleRejectBooking(booking.bookingId)
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`dashboard-status ${booking.status?.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "grounds" && (
          <div>
            <div className="dashboard-section-header">
              <h3>Manage Grounds</h3>
              <button
                className="dashboard-add-btn"
                onClick={() => navigate("/new-venue-registration")}
              >
                <FaPlus /> Add Ground
              </button>
            </div>
            <div className="dashboard-card-grid">
              {grounds.map((ground) => (
                <div key={ground._id} className="dashboard-card">
                  <div className="dashboard-card-header">
                    <div className="dashboard-list-title">
                      {ground.groundName}
                    </div>
                    <button
                      className="dashboard-icon-btn"
                      onClick={() => {
                        // Add your edit modal logic here
                      }}
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <div className="dashboard-list-sub">
                    Sport: {ground.sport}
                  </div>
                  <div className="dashboard-list-sub">
                    Location: {ground.address}
                  </div>
                  <div className="dashboard-list-sub">
                    Bookings: {ground.totalBookings}
                  </div>
                  <div className="dashboard-list-revenue">
                    Revenue: ₨{ground.totalRevenue}
                  </div>
                  <div className="dashboard-status-row">
                    <span
                      className={`dashboard-status ${ground.status?.toLowerCase()}`}
                    >
                      {ground.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <div className="dashboard-section-header">
              <h3>All Bookings</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Search by client or ground"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending-confirmation">
                    Pending Confirmation
                  </option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Ground</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.userName}</td>
                      <td>{booking.groundName}</td>
                      <td>
                        {new Date(booking.slotDate).toLocaleDateString()}{" "}
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td>
                        <span
                          className={`dashboard-status ${booking.status?.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
