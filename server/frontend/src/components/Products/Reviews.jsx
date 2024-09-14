import React, { useState, useEffect } from "react";

const Reviews = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Handle loading state for reviews
  const root_url = "http://localhost:8000/";
  const review_url = `${root_url}djangoapp/reviews`;

  const GetReviews = async (p) => {
    if (!p?.asin || !p?.country) {
      console.log("Product data is incomplete");
      return;
    }

    let url = `${review_url}?asin=${p.asin}&country=${p.country}`;
    try {
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      setReviews(data.data || []);
      console.log(data);
      
      setLoading(false); // Stop loading once reviews are fetched
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (product?.asin && product?.country) {
      GetReviews(product);
    }
  }, [product]); // Re-fetch reviews whenever the product changes

  if (loading) return <div>Loading reviews...</div>; // Display loading state for reviews
  else
    console.log(reviews);
    

  return (
    <>
    <div className="review-section">
    <h2>Customer Reviews</h2>

    {reviews.map((review) => (
        <div key={review.review_id} className="review">
            <div className="review-author-avatar">
                <img src={review.review_author_avatar} alt="" />
            </div>
            <div className="review-content">
                <div className="review-title">{review.review_title}</div>
                <div className="review-star-rating">{review.review_star_rating}</div>
                <p className="review-comment">{review.review_comment}</p>
                <div className="review-author">{review.review_author}</div>
                <div className="review-date">{review.review_date}</div>
                <span className="verified-purchase">{review.is_verified_purchase}</span>
                <a href={review.review_link} className="review-link">Read full review</a>
            </div>
        </div>
    ))}
</div>

    </>
  );
};

export default Reviews;
