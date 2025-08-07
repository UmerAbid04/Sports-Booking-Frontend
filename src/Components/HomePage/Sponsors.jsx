import React, { useEffect, useState, useRef } from "react";
import { Award, Handshake, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { animate, useInView } from "framer-motion";
import "../../styles/Sponsors.css";

const Sponsors = () => {
  const navigate = useNavigate();

  const sponsors = [
    {
      id: 1,
      name: "Nike",
      logo: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Official Sports Partner",
      tier: "platinum",
    },
    {
      id: 2,
      name: "Adidas",
      logo: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Equipment Sponsor",
      tier: "platinum",
    },
    {
      id: 3,
      name: "Puma",
      logo: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Apparel Partner",
      tier: "gold",
    },
    {
      id: 4,
      name: "Under Armour",
      logo: "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Technology Partner",
      tier: "gold",
    },
    {
      id: 5,
      name: "Wilson",
      logo: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Equipment Supplier",
      tier: "silver",
    },
    {
      id: 6,
      name: "Spalding",
      logo: "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
      category: "Ball Supplier",
      tier: "silver",
    },
  ];

  const partnerships = [
    {
      id: 1,
      title: "Official Sports Equipment",
      description: "Premium quality sports equipment from world-renowned brands",
      icon: Award,
    },
    {
      id: 2,
      title: "Venue Partnerships",
      description: "Exclusive partnerships with top-tier sports facilities",
      icon: Handshake,
    },
    {
      id: 3,
      title: "Quality Assurance",
      description: "All partner venues meet our strict quality standards",
      icon: Star,
    },
  ];

  const AnimatedCounter = ({ to, suffix = "", decimals = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });
    const [value, setValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (!isInView || hasAnimated) return;

      const controls = animate(0, to, {
        duration: 2,
        onUpdate: (latest) => {
          const formatted = decimals > 0
            ? parseFloat(latest.toFixed(decimals))
            : Math.floor(latest);
          setValue(formatted);
        },
        onComplete: () => setHasAnimated(true),
      });

      return () => controls.stop();
    }, [isInView, hasAnimated, to, decimals]);

    return (
      <div ref={ref}>
        {value}
        {suffix}
      </div>
    );
  };

  return (
    <section className="sponsors-section">
      <div className="container">
        <div className="header">
          <h2>
            Our <span className="highlights">Partners</span>
          </h2>
          <p>
            Trusted by leading sports brands and premium venue partners worldwide
          </p>
        </div>

        <div className="partnerships">
          {partnerships.map(({ id, title, description, icon: Icon }) => (
            <div className="partnership-card" key={id}>
              <div className="icon-wrapper">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>

        <div className="sponsor-grid">
          {sponsors.map(({ id, name, logo, category, tier }) => (
            <div className={`sponsor-card ${tier.toLowerCase()}`} key={id}>
              <div className="logo-wrapper">
                <img src={logo} alt={name} />
              </div>
              <h4 className="sponsor-name">{name}</h4>
              <p className="sponsor-category">{category}</p>
            </div>
          ))}
        </div>

        <div className="stats">
          <div>
            <h3><AnimatedCounter to={50} suffix="+" /></h3>
            <p>Brand Partners</p>
          </div>
          <div>
            <h3><AnimatedCounter to={500} suffix="+" /></h3>
            <p>Venue Partners</p>
          </div>
          <div>
            <h3><AnimatedCounter to={25} suffix="+" /></h3>
            <p>Cities Covered</p>
          </div>
          <div>
            <h3><AnimatedCounter to={99} suffix="%" /></h3>
            <p>Partner Satisfaction</p>
          </div>
        </div>

        <div className="cta">
          <h3>Interested in Partnership?</h3>
          <p>
            Join our network of premium sports venues and brands. Let's grow the
            sports community together.
          </p>
          <button onClick={() => navigate("/signup?type=company")}>
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
