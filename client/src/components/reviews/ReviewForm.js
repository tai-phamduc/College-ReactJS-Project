import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ movieId, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    title: initialData?.title || '',
    comment: initialData?.comment || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const validate = () => {
    const newErrors = {};
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please enter a comment';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        movieId,
        ...formData,
      });

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          rating: 0,
          title: '',
          comment: '',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star * 2)}
              onMouseEnter={() => setHoverRating(star * 2)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl mr-1 focus:outline-none"
            >
              <FaStar
                className={`${
                  (hoverRating || formData.rating) >= star * 2
                    ? 'text-yellow-400'
                    : 'text-gray-500'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-gray-300">
            {formData.rating > 0 ? `${formData.rating}/10` : 'Select Rating'}
          </span>
        </div>
        {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
      </div>

      {/* Review Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-300 mb-2">
          Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Summarize your thoughts"
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Review Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your thoughts about the movie..."
          rows="4"
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
        {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-900 text-white rounded-md">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary w-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting
          ? 'Submitting...'
          : initialData
          ? 'Update Review'
          : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
