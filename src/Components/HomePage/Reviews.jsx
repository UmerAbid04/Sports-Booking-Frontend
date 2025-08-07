import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await fetch("https://renderbackend-g73i.onrender.com/api/reviews/all");
        const data = await res.json();
        if (res.ok && data.reviews?.length) {
          const shuffled = data.reviews.sort(() => 0.5 - Math.random());
          const limited = shuffled.slice(0, 6);
          setReviews(limited);
        } else {
          console.warn("No reviews found.");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchAllReviews();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews]);

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`star-icon ${i < rating ? 'filled' : ''}`} />
    ));

  if (reviews.length === 0) {
    return (
      <section className="reviews-section">
        <h2>What Our <span className="gradient-text">Users Say</span></h2>
        <p>No reviews yet. Be the first to leave feedback!</p>
      </section>
    );
  }

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2>What Our <span className="gradient-text">Users Say</span></h2>
        <p>Join thousands of satisfied customers who trust us for their sports venue bookings</p>
      </div>

      <div className="review-carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentReview * 100}%)` }}
        >
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="quote-icon"><Quote size={32} /></div>
              <div className="stars">{renderStars(review.rating)}</div>
              <p className="comment">"{review.comment}"</p>
              <div className="reviewer">
                <img
                  src="https://i.pinimg.com/736x/0f/04/ac/0f04ac135a8d6db96514bd97261c1c97.jpg"
                  alt={review?.user?.name || "Anonymous"}
                />
                <div>
                  <h4>{review?.user?.name || "Anonymous"}</h4>
                  <p>Verified Player</p>
                  <span>{review?.company?.name || ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={prevReview} className="nav-btn left"><ChevronLeft /></button>
        <button onClick={nextReview} className="nav-btn right"><ChevronRight /></button>
      </div>

      <div className="carousel-dots">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`dot ${index === currentReview ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="review-stats">
        <div><h3>4.9</h3><p>Average Rating</p></div>
        <div><h3>{reviews.length}</h3><p>Total Reviews</p></div>
        <div><h3>98%</h3><p>Satisfaction</p></div>
        <div><h3>50K+</h3><p>Happy Users</p></div>
      </div>
    </section>
  );
};

export default Reviews;
