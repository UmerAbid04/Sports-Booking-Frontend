import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/AdminDashboard.css";

const companies = [
  {
    id: 1,
    name: "Skyline Sports",
    location: "Lahore",
    contact: "+92 300 1111111",
    capacity: "200 people",
    sports: "Football, Tennis, Swimming",
    timings: "8:00 AM - 11:00 PM",
    days: "Mon-Sat",
    visitorsData: [
      { month: "Jan", visitors: 200 },
      { month: "Feb", visitors: 300 },
      { month: "Mar", visitors: 500 },
      { month: "Apr", visitors: 650 },
      { month: "May", visitors: 800 },
      { month: "Jun", visitors: 1000 },
    ],
    profitData: [
      { month: "Jan", profit: 15000 },
      { month: "Feb", profit: 20000 },
      { month: "Mar", profit: 30000 },
      { month: "Apr", profit: 40000 },
      { month: "May", profit: 50000 },
      { month: "Jun", profit: 60000 },
    ],
  },
  {
    id: 2,
    name: "Elite Grounds",
    location: "Karachi",
    contact: "+92 300 2222222",
    capacity: "150 people",
    sports: "Cricket, Badminton",
    timings: "9:00 AM - 10:00 PM",
    days: "All 7 Days",
    visitorsData: [
      { month: "Jan", visitors: 180 },
      { month: "Feb", visitors: 250 },
      { month: "Mar", visitors: 400 },
      { month: "Apr", visitors: 500 },
      { month: "May", visitors: 650 },
      { month: "Jun", visitors: 900 },
    ],
    profitData: [
      { month: "Jan", profit: 10000 },
      { month: "Feb", profit: 18000 },
      { month: "Mar", profit: 25000 },
      { month: "Apr", profit: 35000 },
      { month: "May", profit: 45000 },
      { month: "Jun", profit: 55000 },
    ],
  },
  {
    id: 3,
    name: "Champion Arena",
    location: "Islamabad",
    contact: "+92 300 3333333",
    capacity: "300 people",
    sports: "Hockey, Football",
    timings: "7:00 AM - 12:00 AM",
    days: "All Week",
    visitorsData: [
      { month: "Jan", visitors: 220 },
      { month: "Feb", visitors: 320 },
      { month: "Mar", visitors: 500 },
      { month: "Apr", visitors: 700 },
      { month: "May", visitors: 900 },
      { month: "Jun", visitors: 1100 },
    ],
    profitData: [
      { month: "Jan", profit: 17000 },
      { month: "Feb", profit: 25000 },
      { month: "Mar", profit: 37000 },
      { month: "Apr", profit: 45000 },
      { month: "May", profit: 60000 },
      { month: "Jun", profit: 75000 },
    ],
  },
  // Add more if needed
];

function AdminDashboard() {
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div className="companies-container">
      <h1 className="dashboard-title">Registered Companies</h1>

      <div className="companies-list">
        {companies.map((company) => (
          <div className="company-card" key={company.id}>
            <h3>{company.name}</h3>
            <button
              onClick={() => setSelectedCompany(company)}
              className="info-button"
            >
              More Info
            </button>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="company-details">
          <h2>{selectedCompany.name} - Details</h2>
          <div className="venue-info-grid">
            <div>
              <strong>Location:</strong> <span>{selectedCompany.location}</span>
            </div>
            <div>
              <strong>Contact:</strong> <span>{selectedCompany.contact}</span>
            </div>
            <div>
              <strong>Capacity:</strong> <span>{selectedCompany.capacity}</span>
            </div>
            <div>
              <strong>Sports Offered:</strong>{" "}
              <span>{selectedCompany.sports}</span>
            </div>
            <div>
              <strong>Available Timings:</strong>{" "}
              <span>{selectedCompany.timings}</span>
            </div>
            <div>
              <strong>Available Days:</strong>{" "}
              <span>{selectedCompany.days}</span>
            </div>
          </div>

          <div className="charts-row" style={{ marginTop: "25px" }}>
            <div className="chart-card">
              <h4>Monthly Visitors</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedCompany.visitorsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#38bdf8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h4>Monthly Profit</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={selectedCompany.profitData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            onClick={() => setSelectedCompany(null)}
            className="edit-button"
            style={{ marginTop: "20px" }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;