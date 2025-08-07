// src/components/homepage/Contact.jsx
import React, { useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import "./../../styles/Contact.css";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await axiosInstance.post("/api/contact", formData);
      setStatus({ type: "success", message: res.data.message });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (platform) => {
    const urls = {
      Facebook: "https://facebook.com/fitzoneelite",
      Instagram: "https://instagram.com/fitzoneelite",
      Twitter: "https://twitter.com/fitzoneelite",
    };
    window.open(urls[platform], "_blank");
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: "123 Fitness Street, Health City, HC 12345",
      colorClass: "info-red",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      colorClass: "info-orange",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@fitzone-elite.com",
      colorClass: "info-blue",
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon-Fri: 5AM–11PM | Sat-Sun: 6AM–10PM",
      colorClass: "info-green",
    },
  ];

  const socialLinks = [
    { icon: Facebook, colorClass: "social-facebook", name: "Facebook" },
    { icon: Instagram, colorClass: "social-instagram", name: "Instagram" },
    { icon: Twitter, colorClass: "social-twitter", name: "Twitter" },
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Section Heading */}
        <div className="contact-heading">
          <h2 className="heading-title">
            Get In <span className="touch">Touch</span>
          </h2>
          <p className="heading-description">
            Ready to start your fitness journey? Reach out to us — we’re here to
            help.
          </p>
        </div>

        <div className="contact-content">
          {/* Left Side: Form */}
          <div className="contact-form">
            <h3 className="form-title">Send us a Message</h3>
            <form className="form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter your First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter your Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your fitness goals..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p className={`status-message ${status.type}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>

          {/* Right Side: Contact Info */}
          <div className="contact-info">
            <div className="info-block">
              <h3 className="info-title">Contact Information</h3>
              <div className="info-list">
                {contactInfo.map((info, index) => (
                  <div key={index} className="info-item">
                    <div className={`info-icon ${info.colorClass}`}>
                      <info.icon className="icon" />
                    </div>
                    <div className="info-text">
                      <h4 className="info-label">{info.title}</h4>
                      <p className="info-content">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="map-placeholder">
              <MapPin className="map-icon" />
              <p>Map integration coming soon</p>
            </div>

            {/* Social Links */}
            <div className="social-block">
              <h4 className="social-title">Follow Us</h4>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    className={`social-button ${social.colorClass}`}
                    onClick={() => handleSocialClick(social.name)}
                    aria-label={social.name}
                  >
                    <social.icon className="icon" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
