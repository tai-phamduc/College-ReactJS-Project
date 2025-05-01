import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPen } from 'react-icons/fa';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { movieService, authService } from '../../services/api';
import './MovieReviewsSection.css';

const MovieReviewsSection = ({ movieId, movieTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const currentUser = authService.getCurrentUser();
  const isLoggedIn = authService.isLoggedIn();

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  // Fetch reviews from API
  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedReviews = await movieService.getMovieReviews(movieId);
      setReviews(fetchedReviews);
      
      // Check if current user has already reviewed
      if (isLoggedIn && currentUser) {
        const userReview = fetchedReviews.find(
          review => review.userId === currentUser._id
        );
        
        if (userReview) {
          setUserReview(userReview);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (reviewData) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditing && userReview) {
        // Update existing review
        const updatedReview = await movieService.updateReview(
          movieId, 
          userReview._id, 
          reviewData
        );
        
        // Update reviews list
        setReviews(reviews.map(review => 
          review._id === updatedReview._id ? updatedReview : review
        ));
        
        setUserReview(updatedReview);
      } else {
        // Create new review
        const newReview = await movieService.addReview(movieId, reviewData);
        
        // Add to reviews list
        setReviews([newReview, ...reviews]);
        setUserReview(newReview);
      }
      
      // Hide form after submission
      setShowForm(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setUserReview(review);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await movieService.deleteReview(movieId, reviewId);
      
      // Remove from reviews list
      setReviews(reviews.filter(review => review._id !== reviewId));
      
      // Clear user review if it was deleted
      if (userReview && userReview._id === reviewId) {
        setUserReview(null);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again later.');
    }
  };

  // Handle marking review as helpful
  const handleMarkHelpful = async (reviewId) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    try {
      const updatedReview = await movieService.markReviewHelpful(movieId, reviewId);
      
      // Update reviews list
      setReviews(reviews.map(review => 
        review._id === updatedReview._id ? updatedReview : review
      ));
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  // Handle reporting review
  const handleReportReview = async (reviewId) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    const reason = prompt('Please provide a reason for reporting this review:');
    
    if (!reason) return;
    
    try {
      await movieService.reportReview(movieId, reviewId, { reason });
      alert('Review has been reported. Thank you for your feedback.');
    } catch (err) {
      console.error('Error reporting review:', err);
      alert('Failed to report review. Please try again later.');
    }
  };

  return (
    <div className="movie-reviews-section">
      <div className="section-header">
        <h2 className="section-title">Reviews for {movieTitle}</h2>
        
        {isLoggedIn && !showForm && (
          <button 
            className="write-review-button"
            onClick={() => {
              setIsEditing(!!userReview);
              setShowForm(true);
            }}
          >
            <FaPen />
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </button>
        )}
        
        {!isLoggedIn && !showLoginPrompt && (
          <button 
            className="write-review-button"
            onClick={() => setShowLoginPrompt(true)}
          >
            <FaPen />
            Write a Review
          </button>
        )}
      </div>
      
      {showLoginPrompt && (
        <div className="login-prompt">
          <p>Please log in to write a review or interact with reviews.</p>
          <div className="prompt-actions">
            <a href="/login" className="login-button">Log In</a>
            <a href="/register" className="register-button">Register</a>
            <button 
              className="cancel-button"
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {showForm && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          initialRating={isEditing && userReview ? userReview.rating : 0}
          initialComment={isEditing && userReview ? userReview.comment : ''}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          currentUser={currentUser}
        />
      )}
      
      {error && !isLoading && (
        <div className="error-message">{error}</div>
      )}
      
      <ReviewList
        reviews={reviews}
        currentUserId={currentUser ? currentUser._id : null}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
        onHelpful={handleMarkHelpful}
        onReport={handleReportReview}
        isLoading={isLoading && !error}
        error={isLoading ? null : error}
      />
    </div>
  );
};

MovieReviewsSection.propTypes = {
  movieId: PropTypes.string.isRequired,
  movieTitle: PropTypes.string.isRequired
};

export default MovieReviewsSection;
