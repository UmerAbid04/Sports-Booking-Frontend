import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/VenueDashboard.css";

const visitorData = [
  { month: "Jan", visitors: 300 },
  { month: "Feb", visitors: 500 },
  { month: "Mar", visitors: 700 },
  { month: "Apr", visitors: 600 },
  { month: "May", visitors: 850 },
  { month: "Jun", visitors: 1250 },
];

const profitData = [
  { month: "Jan", profit: 20000 },
  { month: "Feb", profit: 30000 },
  { month: "Mar", profit: 45000 },
  { month: "Apr", profit: 50000 },
  { month: "May", profit: 70000 },
  { month: "Jun", profit: 85000 },
];

function VenueDashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Venue Admin Dashboard</h1>

      {/* Venue Info */}
      <div className="dashboard-section profile-section">
        <h2>Your Venue Information</h2>
        <div className="venue-info-grid">
          <div>
            <strong>Venue Name:</strong> <span>Anyname</span>
          </div>
          <div>
            <strong>Location:</strong> <span>Any location</span>
          </div>
          <div>
            <strong>Contact:</strong> <span>+92 300 000000</span>
          </div>
          <div>
            <strong>Capacity:</strong> <span>100 people</span>
          </div>
          <div>
            <strong>Sports Offered:</strong>{" "}
            <span>Football, Cricket, Badminton</span>
          </div>
          <div>
            <strong>Available Timings:</strong> <span>10:00 AM - 10:00 PM</span>
          </div>
          <div>
            <strong>Available Days:</strong> <span>All 7 Days</span>
          </div>
        </div>
        <button className="edit-button">Edit Information</button>
      </div>

      {/* Visitor, Profit & Revenue Overview with Graphs */}
      <div className="dashboard-section stats-section">
        <h2>Visitor, Profit & Revenue Overview</h2>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>Visitors This Month</h3>
            <p>1,250</p>
          </div>
          <div className="stat-card">
            <h3>Profit This Month</h3>
            <p>PKR 85,000</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings this Month</h3>
            <p>32</p>
          </div>
        </div>

        <hr className="line1"></hr>

        <div className="charts-row">
          <div className="chart-card">
            <h4>Monthly Visitors</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={visitorData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Monthly Profit</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={profitData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Monthly Revenue</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={profitData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings + Customer Messages Row */}
      <div className="dashboard-section row-section">
        <div
          className="bookings-section"
          style={{ flex: 1, marginRight: "15px" }}
        >
          <h2>Upcoming Bookings</h2>
          <ul>
            <li>July 12 - 5 PM - Football</li>
            <li>July 13 - 7 PM - Badminton</li>
            <li>July 14 - 4 PM - Cricket</li>
          </ul>
        </div>

        <div className="messages-section" style={{ flex: 1 }}>
          <h2>Customer Messages</h2>
          <div className="message-card">
            <p>“Is the cricket pitch available tomorrow evening?”</p>
            <span>- Usman</span>
          </div>
          <div className="message-card">
            <p>“Can I book for 20 people?”</p>
            <span>- Hina</span>
          </div>
        </div>
      </div>

      {/* Top Sports + Latest Reviews Row */}
      <div className="dashboard-section row-section">
        <div
          className="top-sports-section"
          style={{ flex: 1, marginRight: "15px" }}
        >
          <h2>Top Sports Booked</h2>
          <ul>
            <li>⚽ Football - 150 bookings</li>
            <li>🏸 Badminton - 100 bookings</li>
            <li>🏏 Cricket - 70 bookings</li>
          </ul>
        </div>

        <div className="reviews-section" style={{ flex: 1 }}>
          <h2>Latest Reviews</h2>
          <div className="review-card">
            <p>"Great venue, very clean and well maintained!"</p>
            <span>- Ali Khan</span>
          </div>
          <div className="review-card">
            <p>"Had a wonderful time playing football. Will book again!"</p>
            <span>- Sarah Ahmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDashboard;
