import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaThumbsUp, FaThumbsDown, FaFlag, FaEllipsisV, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import './ReviewList.css';

const ReviewList = ({ 
  reviews, 
  currentUserId,
  onEdit,
  onDelete,
  onHelpful,
  onReport,
  isLoading = false,
  error = null
}) => {
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle review expansion
  const toggleExpand = (reviewId) => {
    if (expandedReviews.includes(reviewId)) {
      setExpandedReviews(expandedReviews.filter(id => id !== reviewId));
    } else {
      setExpandedReviews([...expandedReviews, reviewId]);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (reviewId) => {
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    
    return <div className="star-display">{stars}</div>;
  };

  // Sort reviews
  const sortReviews = (reviews) => {
    if (!reviews) return [];
    
    const reviewsCopy = [...reviews];
    
    switch (sortBy) {
      case 'newest':
        return reviewsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return reviewsCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highest':
        return reviewsCopy.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviewsCopy.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return reviewsCopy.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
      default:
        return reviewsCopy;
    }
  };

  // Check if review is by current user
  const isCurrentUserReview = (review) => {
    return currentUserId && review.userId === currentUserId;
  };

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Calculate rating distribution
  const calculateRatingDistribution = (reviews) => {
    if (!reviews || reviews.length === 0) return [0, 0, 0, 0, 0];
    
    const distribution = [0, 0, 0, 0, 0];
    
    reviews.forEach(review => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++;
      }
    });
    
    return distribution;
  };

  const sortedReviews = sortReviews(reviews);
  const averageRating = calculateAverageRating(reviews);
  const ratingDistribution = calculateRatingDistribution(reviews);
  const totalReviews = reviews ? reviews.length : 0;

  if (isLoading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="reviews-container" onClick={closeDropdown}>
      <div className="reviews-header">
        <div className="reviews-summary">
          <div className="average-rating">
            <div className="rating-number">{averageRating}</div>
            {renderStarRating(parseFloat(averageRating))}
            <div className="total-reviews">{totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}</div>
          </div>
          
          <div className="rating-distribution">
            {ratingDistribution.map((count, index) => {
              const starNumber = 5 - index;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={starNumber} className="distribution-row">
                  <div className="star-label">{starNumber} {starNumber === 1 ? 'Star' : 'Stars'}</div>
                  <div className="distribution-bar-container">
                    <div 
                      className="distribution-bar" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="distribution-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="reviews-sort">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>
      
      <div className="reviews-list">
        {sortedReviews.map((review) => {
          const isExpanded = expandedReviews.includes(review._id);
          const isDropdownActive = activeDropdown === review._id;
          const isUserReview = isCurrentUserReview(review);
          
          return (
            <div 
              key={review._id} 
              className={`review-item ${isUserReview ? 'user-review' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-name">
                      {review.userName || 'Anonymous'}
                      {isUserReview && <span className="user-badge">You</span>}
                    </div>
                    <div className="review-date">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
                
                <div className="review-rating">
                  {renderStarRating(review.rating)}
                </div>
              </div>
              
              <div className="review-content">
                <p className={`review-text ${!isExpanded && review.comment.length > 300 ? 'truncated' : ''}`}>
                  {isExpanded || review.comment.length <= 300 
                    ? review.comment 
                    : `${review.comment.substring(0, 300)}...`}
                </p>
                
                {review.comment.length > 300 && (
                  <button 
                    className="read-more-button" 
                    onClick={() => toggleExpand(review._id)}
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
              
              <div className="review-actions">
                <button 
                  className={`action-button ${review.userHelpful ? 'active' : ''}`}
                  onClick={() => onHelpful && onHelpful(review._id)}
                  aria-label="Mark as helpful"
                >
                  <FaThumbsUp />
                  <span>Helpful {review.helpfulCount > 0 ? `(${review.helpfulCount})` : ''}</span>
                </button>
                
                {!isUserReview && (
                  <button 
                    className="action-button"
                    onClick={() => onReport && onReport(review._id)}
                    aria-label="Report review"
                  >
                    <FaFlag />
                    <span>Report</span>
                  </button>
                )}
                
                {isUserReview && (
                  <div className="review-options">
                    <button 
                      className="options-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(review._id);
                      }}
                      aria-label="Review options"
                    >
                      <FaEllipsisV />
                    </button>
                    
                    {isDropdownActive && (
                      <div className="options-dropdown">
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            onEdit && onEdit(review);
                            setActiveDropdown(null);
                          }}
                        >
                          <FaPencilAlt />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="dropdown-item delete"
                          onClick={() => {
                            onDelete && onDelete(review._id);
                            setActiveDropdown(null);
                          }}
                        >
                          <FaTrashAlt />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.array,
  currentUserId: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onHelpful: PropTypes.func,
  onReport: PropTypes.func,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default ReviewList;
