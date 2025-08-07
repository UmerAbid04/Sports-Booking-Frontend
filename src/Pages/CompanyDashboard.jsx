import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosinstance";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaCog,
  FaBell,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyDashboard.css";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGround, setSelectedGround] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    revenue: 0,
    grounds: 0,
  });
  const [editGround, setEditGround] = useState({
    id: null,
    name: "",
    sport: "",
    location: "",
    status: "Active",
    bookings: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          console.log("Bookings response:", bookingsRes.data);
          setGrounds(groundsRes.data || []);
          setRecentBookings(bookingsRes.data || []);
          setStats({
            totalBookings: totalBookingsRes.data?.count || 0,
            upcomingBookings: upcomingBookingsRes.data?.count || 0,
            revenue: revenueRes.data?.total || 0,
            grounds: totalGroundsRes.data?.count || 0,
          });
          setLoading(false);
        }
      )
      .catch(() => {
        setError("Please wait while the admin approves your account.");
        setLoading(false);
      });
  }, []);

  const handleAddGround = (groundData) => {
    axiosInstance
      .post("/api/company/grounds", groundData)
      .then((res) => setGrounds((prev) => [...prev, res.data]))
      .catch(() => setError("Failed to add ground."));
  };

  const handleEditGround = (id, groundData) => {
    axiosInstance
      .put(`/api/company/grounds/${id}`, groundData)
      .then((res) =>
        setGrounds((prev) => prev.map((g) => (g._id === id ? res.data : g)))
      )
      .catch(() => setError("Failed to edit ground."));
  };

  const handleApproveBooking = async (id) => {
    try {
      await axiosInstance.patch(
        `/api/company/dashboard/bookings/approve/${id}`
      );
      setRecentBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "approved" } : b))
      );
    } catch (err) {
      console.error(
        "Approve booking error:",
        err.response || err.message || err
      );
      setError("Failed to approve booking.");
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      await axiosInstance.patch(`/api/company/dashboard/bookings/reject/${id}`);
      setRecentBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "rejected" } : b))
      );
    } catch (err) {
      console.error(
        "Reject booking error:",
        err.response || err.message || err
      );
      setError("Failed to reject booking.");
    }
  };

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
            <div className="stat-trend positive"></div>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <div className="stat-title">Upcoming Bookings</div>
            <div className="stat-value">{stats.upcomingBookings}</div>
            <div className="stat-trend positive"></div>
          </div>
        </div>
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div>
            <div className="stat-title">Revenue</div>
            <div className="stat-value">₨{stats.revenue.toLocaleString()}</div>
            <div className="stat-trend positive"></div>
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
          <div className="dashboard-overview-grid">
            <div className="dashboard-card">
              <h3>Recent Bookings</h3>
              <div className="dashboard-list">
                {recentBookings.map((booking, idx) => (
                  <div key={idx} className="dashboard-list-item">
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
                      <span
                        className={`dashboard-status ${booking.status?.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-card">
              <h3>Ground Performance</h3>
              <div className="dashboard-list">
                {grounds.slice(0, 3).map((ground) => (
                  <div key={ground._id} className="dashboard-list-item">
                    <div>
                      <div className="dashboard-list-title">{ground.name}</div>
                      <div className="dashboard-list-sub">{ground.sport}</div>
                    </div>
                    <div className="dashboard-list-right">
                      <div className="dashboard-list-revenue">
                        ₨{ground.revenue}
                      </div>
                      <div className="dashboard-list-bookings">
                        {ground.bookings} bookings
                      </div>
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
              {grounds.map((ground) => {
                console.log("Ground data:", ground); // Log all properties
                return (
                  <div key={ground._id} className="dashboard-card">
                    <div className="dashboard-card-header">
                      <div className="dashboard-list-title">
                        {ground.groundName}
                      </div>
                      <button
                        className="dashboard-icon-btn"
                        onClick={() => {
                          setEditGround(ground);
                          setShowEditModal(true);
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
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <div className="dashboard-section-header">
              <h3>All Bookings</h3>
              <div>
                <button className="dashboard-icon-btn">
                  <FaSearch /> Search
                </button>
                <button className="dashboard-icon-btn">
                  <FaFilter /> Filter
                </button>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id}>
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
                      <td>
                        {booking.status === "pending" ? (
                          <>
                            <button
                              className="dashboard-icon-btn"
                              onClick={() => handleApproveBooking(booking._id)}
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              className="dashboard-icon-btn"
                              onClick={() => handleRejectBooking(booking._id)}
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        ) : (
                          <span style={{ fontStyle: "italic", color: "gray" }}>
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
