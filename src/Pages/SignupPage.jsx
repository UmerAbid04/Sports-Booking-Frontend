import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import {
  FaEye, FaEyeSlash, FaUser, FaBuilding, FaEnvelope,
  FaLock, FaPhone
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginSignup.css";
import axiosInstance from "../api/axiosinstance";

// Google Icon component
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

const SignupPage = ({ setShowNavbar, setShowFooter }) => {
  const [userType, setUserType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [errmsg, setErrmsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    phone: ""
  });
  const navigate = useNavigate();

  // Hide navbar/footer during signup
  useEffect(() => {
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!formData.fullName || !formData.email || !formData.password || !formData.phone || (userType === "company" && !formData.companyName)) {
      setErrmsg("All fields are required.");
      return;
    }

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };
      if (userType === "company") {
        payload.companyName = formData.companyName;
      }

      const endpoint = userType === "company"
        ? "/api/auth/register/company"
        : "/api/auth/register/client";

      console.log("Sending to:", endpoint);
      console.log("Payload:", payload);

      const res = await axiosInstance.post(endpoint, payload);

      if (res.status === 201) {
        console.log("Signup success:", res.data);
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.status === 409) {
        setErrmsg("Email already registered.");
      } else {
        setErrmsg("Something went wrong. Please try again.");
      }
    }
  };

  // Moved here so it’s accessible
  const handleSocialSignup = async (provider) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/oauth-bridge`, // Adjust path if needed
      },
    });
    if (error) throw error;
  } catch (err) {
    console.error("OAuth Signup Error:", err.message);
  }
};


  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-title">SportBook</div>
        <div className="login-subtitle">Create your sports facility account</div>

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
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label className="login-label" htmlFor="fullName">Full Name</label>
            <FaUser className="login-icon" />
            <input
              className="login-input"
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              autoComplete="name"
              required
            />
          </div>

          {userType === "company" && (
            <div className="login-input-group">
              <label className="login-label" htmlFor="companyName">Company Name</label>
              <FaBuilding className="login-icon" />
              <input
                className="login-input"
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="login-input-group">
            <label className="login-label" htmlFor="email">Email</label>
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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="login-input-group">
            <label className="login-label" htmlFor="phone">Phone Number</label>
            <FaPhone className="login-icon" />
            <input
              className="login-input"
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {errmsg && <p style={{ color: "#e11d48", textAlign: "center", marginBottom: 8 }}>{errmsg}</p>}

          <button className="login-btn" type="submit" style={{ margin: "12px auto 8px auto", display: "block" }}>
            CREATE ACCOUNT
          </button>

          <div style={{ textAlign: 'center', color: '#bdbdbd', fontSize: '0.95rem', marginBottom: 18 }}>
            By creating an account, you agree to our
            <span> </span>
            <a href="#" style={{ color: '#4f8cff', textDecoration: 'underline' }}>Terms of Service</a>
            <span> and </span>
            <a href="#" style={{ color: '#4f8cff', textDecoration: 'underline' }}>Privacy Policy</a>
          </div>
        </form>

        <div className="login-divider">
          <div className="login-divider-line"></div>
          <span className="login-divider-text">Or sign up with</span>
          <div className="login-divider-line"></div>
        </div>

        <div className="login-social-row">
          <button
            className="login-social-btn"
            type="button"
            onClick={() => handleSocialSignup("Google")}
          >
            <GoogleIcon />
            Google
          </button>
        </div>

        <div className="login-signup-row" style={{ justifyContent: 'center', display: 'flex', marginTop: 10 }}>
          Already have an account?
          <Link className="login-signup-link" to="/login" style={{ marginLeft: 8 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
