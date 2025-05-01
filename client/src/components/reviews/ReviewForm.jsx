import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaUser } from 'react-icons/fa';
import './ReviewForm.css';

const ReviewForm = ({ 
  onSubmit, 
  initialRating = 0, 
  initialComment = '', 
  isEditing = false,
  isSubmitting = false,
  currentUser = null
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Please enter a comment';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Submit the review
    onSubmit({ rating, comment });
  };

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h3>
      
      {currentUser ? (
        <div className="user-info">
          <div className="user-avatar">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="user-name">
            {currentUser.name || `${currentUser.firstName} ${currentUser.lastName}` || 'Anonymous'}
          </div>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${
                  (hoverRating || rating) >= star ? 'active' : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} stars`}
              >
                <FaStar />
              </button>
            ))}
            <span className="rating-text">
              {rating > 0 ? `${rating} Star${rating !== 1 ? 's' : ''}` : 'Select Rating'}
            </span>
          </div>
          {errors.rating && <div className="error-message">{errors.rating}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows={5}
            className={errors.comment ? 'error' : ''}
          />
          {errors.comment && <div className="error-message">{errors.comment}</div>}
          <div className="character-count">
            {comment.length} characters (minimum 10)
          </div>
        </div>
        
        <div className="review-guidelines">
          <h4>Review Guidelines</h4>
          <ul>
            <li>Focus on the movie content and your experience</li>
            <li>Avoid spoilers or personal attacks</li>
            <li>Keep it civil and helpful for other moviegoers</li>
          </ul>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {isEditing ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              isEditing ? 'Update Review' : 'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialRating: PropTypes.number,
  initialComment: PropTypes.string,
  isEditing: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  currentUser: PropTypes.object
};

export default ReviewForm;
