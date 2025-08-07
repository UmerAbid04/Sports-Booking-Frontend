// src/components/homepage/About.jsx
import React from "react";
import { Award, Target, Heart, Users } from "lucide-react";
import "../../styles/About.css";


const About = () => {
  const values = [
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "We help you set and achieve realistic fitness goals with personalized guidance",
    },
    {
      icon: Heart,
      title: "Community Focus",
      description: "Building a supportive environment where everyone feels welcome and motivated",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the highest quality equipment, facilities, and service",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified trainers and staff dedicated to your success and safety",
    },
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content">
          {/* Left Text Column */}
          <div className="about-text">
            <h2 className="about-heading">
              Empowering Your <span className="fitness-journey">Fitness Journey</span>
            </h2>
            <p className="about-description">
              For over 15 years, FitZone Elite has been the premier destination for fitness enthusiasts seeking excellence.
              From beginners to elite athletes, we provide the tools, support, and community you need.
            </p>

            <div className="about-stats">
              {[
                { label: "Happy Members", value: "5,000+", colorClass: "stat-orange" },
                { label: "Expert Trainers", value: "50+", colorClass: "stat-blue" },
                { label: "24/7 Access", value: "24/7", colorClass: "stat-green" },
                { label: "Years Experience", value: "15+", colorClass: "stat-purple" },
              ].map((item, i) => (
                <div key={i} className={`stat-box ${item.colorClass}`}>
                  <div className="stat-value">{item.value}</div>
                  <p className="stat-label">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Column */}
          <div className="about-image-block">
            <div className="image-container">
              <div className="image-overlay" />
            </div>

            <div className="rating-card">
              <div className="rating-icon">
                <Award className="icon-white" />
              </div>
              <div className="rating-info">
                <p className="rating-value">4.9★</p>
                <p className="rating-label">Member Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="core-values-section">
          <h3 className="core-values-title">Our Core Values</h3>
          <div className="core-values-grid">
            {values.map((v, i) => (
              <div key={i} className="core-value-card">
                <div className="core-value-icon">
                  <v.icon className="icon-white" />
                </div>
                <h4 className="core-value-title">{v.title}</h4>
                <p className="core-value-description">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
