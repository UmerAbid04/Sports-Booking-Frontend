import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./../styles/ForgotPassword.css";

const ForgotPassword = ({ setShowNavbar, setShowFooter }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setShowNavbar(false);
    setShowFooter(false);
    return () => {
      setShowNavbar(true);
      setShowFooter(true);
    };
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Simulated success
    setMessage("Password reset link sent to your email (simulation).");
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleReset} className="auth-form">
          <h2>Forgot Password</h2>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope />
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <div className="action-buttons">
            <button type="submit">Send Reset Link</button>
          </div>

          <div className="extra-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
