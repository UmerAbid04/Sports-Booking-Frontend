// src/Pages/LoginPage.jsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaBuilding, FaEnvelope, FaLock, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSignup.css";
import axios from "../api/axiosinstance"; 
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qhsfxcesuhbpvhquuzod.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoc2Z4Y2VzdWhicHZocXF1em9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzcxNjQsImV4cCI6MjA2NzY1MzE2NH0.fS-T2lJGSpc8OWrOADjrpg8E-ZwX0AcBVxBxnrJ0KbY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <g>
      <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.227 0-3.438 2.75-6.227 6.125-6.227 1.922 0 3.211.82 3.953 1.523l2.703-2.617c-1.711-1.57-3.922-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.672z" fill="#FFC107"/>
      <path d="M3.152 6.345l3.289 2.414c.898-1.367 2.406-2.414 4.099-2.414 1.117 0 2.164.414 2.969 1.094l2.789-2.719c-1.711-1.57-3.922-2.539-6.656-2.539-3.617 0-6.703 2.07-8.242 5.086z" fill="#FF3D00"/>
      <path d="M12 22c2.672 0 4.922-.883 6.563-2.398l-3.047-2.492c-.828.586-1.953.992-3.516.992-2.703 0-4.992-1.828-5.805-4.289l-3.242 2.5c1.523 3.047 4.75 5.187 8.047 5.187z" fill="#4CAF50"/>
      <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.227 0-.547.07-1.078.164-1.586l-3.242-2.5c-.414.828-.664 1.75-.664 2.75 0 5.523 4.477 10 10 10 5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.672z" fill="#1976D2"/>
    </g>
  </svg>
); 

const LoginPage = ({ setShowNavbar, setShowFooter }) => {
  const [userType, setUserType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errmsg, setErrmsg] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (setShowNavbar) setShowNavbar(false);
    if (setShowFooter) setShowFooter(false);
    document.body.style.overflow = "hidden";
    return () => {
      if (setShowNavbar) setShowNavbar(true);
      if (setShowFooter) setShowFooter(true);
      document.body.style.overflow = "auto";
    };
  }, [setShowNavbar, setShowFooter]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrmsg("");

  if (!formData.email || !formData.password) {
    setErrmsg("Please enter both email and password");
    return;
  }

  try {
    const endpointMap = {
      user: "/api/auth/login/client",
      company: "/api/auth/login/company",
      admin: "/api/auth/login/admin",
    };

    const res = await axios.post(
      endpointMap[userType],
      {
        email: formData.email,
        password: formData.password,
      },
      {
        withCredentials: true,
      }
    );

    console.log("Login response:", res.data); // ✅ NOW it’s valid here

   const { role, token } = res.data; // get token

localStorage.setItem("authToken", token); // ✅ consistent with review logic

localStorage.setItem("currentUser", JSON.stringify({ email: formData.email, role }));


if (role === "admin") navigate("/admin-panel");
else if (role === "company") navigate("/company-dashboard");
else navigate("/");

  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    if (err.response?.status === 404) {
      setErrmsg("User not found");
    } else if (err.response?.status === 401) {
      setErrmsg("Invalid credentials");
    } else {
      setErrmsg("Login failed. Please try again.");
    }
  }
};

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-title">SportBook</div>
        <div className="login-subtitle">Welcome back to your sports facility platform</div>

        <div className="login-toggle">
          <button
            type="button"
            className={`login-toggle-btn${userType === "user" ? " active" : ""}`}
            onClick={() => setUserType("user")}
          >
            <FaUser style={{ marginRight: 6 }} /> User
          </button>
          <button
            type="button"
            className={`login-toggle-btn${userType === "company" ? " active" : ""}`}
            onClick={() => setUserType("company")}
          >
            <FaBuilding style={{ marginRight: 6 }} /> Company
          </button>
          <button
            type="button"
            className={`login-toggle-btn${userType === "admin" ? " active" : ""}`}
            onClick={() => setUserType("admin")}
          >
            <FaLock style={{ marginRight: 6 }} /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label className="login-label" htmlFor="email">Email Address</label>
            <FaEnvelope className="login-icon" />
            <input
              className="login-input"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="login-input-group">
            <label className="login-label" htmlFor="password">Password</label>
            <FaLock className="login-icon" />
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errmsg && <p style={{ color: "#e11d48", textAlign: "center", marginBottom: 8 }}>{errmsg}</p>}
          <button className="login-btn" type="submit">SIGN IN</button>
        </form>
        {userType === "company" && (
          <div style={{ color: '#bdbdbd', fontSize: '0.95rem', textAlign: 'center', margin: '10px 0 0 0' }}>
         
          </div>
        )}
        {userType === "admin" && (
          <div style={{ color: '#bdbdbd', fontSize: '0.95rem', textAlign: 'center', margin: '10px 0 0 0' }}>
        
          </div>
        )}

        <button
  className="login-forgot"
  type="button"
  onClick={() => navigate("/forgot-password")}
>
  Forgot your password?
</button>


        <div className="login-divider">
          <div className="login-divider-line"></div>
          <span className="login-divider-text">Or continue with</span>
          <div className="login-divider-line"></div>
        </div>

<button
  className="login-social-btn"
  type="button"
  onClick={() => {
    window.location.href =
      "https://qhsfxcesuhbpvhquuzod.supabase.co/auth/v1/authorize" +
      "?provider=google" +
      "&redirect_to=https://sports-booking-frontend-sage.vercel.app/oauth-bridge.html";
  }}
>
  <GoogleIcon /> Google
</button>



        <div style={{ textAlign: "center", marginTop: 10 }}>
  <div className="login-signup-row">
    Don't have an account?
    <span
      className="login-signup-link"
      onClick={() => navigate("/signup")}
      tabIndex={0}
      role="button"
      style={{ marginLeft: 8 }}
    >
      Sign up
    </span>
  </div>
  <div className="login-signup-row" style={{ justifyContent: 'center', display: 'flex', marginTop: 6 }}>
  <span
    className="login-signup-link"
    onClick={() => navigate("/")}
    tabIndex={0}
    role="button"
  >
    Continue as Guest
  </span>
</div>
</div>


      </div>
    </div>
  );
};

export default LoginPage;
