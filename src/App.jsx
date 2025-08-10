// src/App.jsx
import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState(null); // Track logged-in user

  useEffect(() => {
    // Try to restore session from localStorage tokens
    async function restoreSession() {
      const access_token = localStorage.getItem('sb-access-token');
      const refresh_token = localStorage.getItem('sb-refresh-token');

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          console.error('Failed to restore session:', error.message);
          setUser(null);
        } else {
          const { data } = supabase.auth.getSession();
          setUser(data.session?.user ?? null);
          console.log('Session restored:', data.session);
        }
      } else {
        // No session tokens found
        setUser(null);
      }
    }

    restoreSession();

    // Also listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header><title>Sport Book</title></header>

      <ScrollToTop />
      {showNavbar && <Navbar user={user} />}

      <div className={`main-content ${showNavbar ? "with-navbar" : ""}`}>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setShowNavbar={setShowNavbar}
                setShowFooter={setShowFooter}
                user={user}
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
          {/* Other routes remain unchanged */}
          <Route path="/new-venue-registration" element={<NewVenueReg setShowNavbar={setShowNavbar} setShowFooter={setShowFooter} />} />
          <Route path="/venue-dashboard" element={<VenueDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/city/:cityName" element={<CityVenuePage />} />
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
