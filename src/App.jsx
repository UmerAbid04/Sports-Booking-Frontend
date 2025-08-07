import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import VenueDashboard from "./Pages/VenueDashboard";
import NewVenueReg from "./Pages/NewVenueReg";
import AdminDashboard from "./Pages/AdminDashboard";
import BookingPage from "./Pages/BookingPage";
import CategoryPage from "./Pages/CategoryPage";
import CityVenuePage from "./Pages/CityVenuePage";
import ScrollToTop from "./Components/ScrollToTop";
import ForgotPassword from "./Pages/ForgotPassword";
import UserSetting from "./Pages/UserSetting";
import CompanyDashboard from "./Pages/CompanyDashboard";
import AdminPanel from "./Pages/AdminPanel";
import PaymentPage from "./Pages/Payment";
import DefineSlots from "./Pages/DefineSlots";

import "./App.css";

function App() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);


  return (
    <>
    <header><title>Sport Book</title></header>
    
    <ScrollToTop />
      {showNavbar && <Navbar />}

      <div className={`main-content ${showNavbar ? "with-navbar" : ""}`}>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setShowNavbar={setShowNavbar}
                setShowFooter={setShowFooter}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setShowNavbar={setShowNavbar}
                setShowFooter={setShowFooter}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignupPage
                setShowNavbar={setShowNavbar}
                setShowFooter={setShowFooter}
              />
            }
          />
          <Route
            path="/new-venue-registration"
            element={
              <NewVenueReg
                setShowNavbar={setShowNavbar}
                setShowFooter={setShowFooter}
              />
            }
          />
          <Route path="/venue-dashboard" element={<VenueDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/city/:cityName" element={<CityVenuePage />}/>
          <Route path="/forgot-password" element={<ForgotPassword setShowNavbar={setShowNavbar} setShowFooter={setShowFooter} />} />
          <Route path="/account" element={<UserSetting />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/define-slots" element={<DefineSlots />} />
        </Routes>
      </div>

      {showFooter && <Footer />}
    </>
  );
}

export default App;
