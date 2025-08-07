import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../Components/HomePage/Hero";
import FeaturedCarousel from "../Components/HomePage/FeaturedCarousel";
import ExploreByCategory from "../Components/HomePage/ExploreByCategory";
import ExploreByLocation from "../Components/HomePage/ExploreByLocation";
import Locations from "../Components/HomePage/Locations";
import WhatsNew from "../Components/HomePage/WhatsNew";
import Reviews from "../Components/HomePage/Reviews";
import Sponsors from "../Components/HomePage/Sponsors";
import Contact from "../Components/HomePage/Contact";
import About from "../Components/HomePage/About";




const HomePage = ({ setShowNavbar, setShowFooter }) => {
  const navigate = useNavigate(); 

  useEffect(() => {
    setShowNavbar(true);
    setShowFooter(true);
  }, [setShowNavbar, setShowFooter]);

  const handleBookingClick = () => {
    navigate("/booking"); 
  };

  return (
    <>
      <Hero />
      <div id="events">
        {/*<FeaturedCarousel />*/}
      </div>
      <div id="sports">
        <ExploreByCategory />
      </div>
      <div id="venues">
        <ExploreByLocation />
      </div>
      <Locations />
      <div id="whatsnew">
      <WhatsNew />
      </div>
     <Reviews companyId="6899aa1234567890abcdef01" />





      <Sponsors />
      <div id="contact">
        <Contact />
      </div>
      <div id="about">
        <About />
      </div>

      <button className="floating-btn" onClick={handleBookingClick}>Book Now</button>
    </>
  );
};

export default HomePage;
