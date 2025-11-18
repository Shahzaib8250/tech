import React from 'react';
import './StarRating.css';

const StarRating = ({ label, value, onChange, name, required = false }) => {
  const handleStarClick = (rating) => {
    // If clicking the same rating, deselect it
    const newRating = value === rating ? 0 : rating;
    onChange(name, newRating);
  };

  return (
    <div className="star-rating-group">
      {label && (
        <label className="star-rating-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="star-rating-item">
            <span className="star-number">{star}</span>
            <button
              type="button"
              className={`star-button ${value >= star ? 'selected' : ''}`}
              onClick={() => handleStarClick(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={value >= star ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                className="star-icon"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarRating;

