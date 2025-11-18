import React from 'react';
import StarRating from '../StarRating';

const FeatureRatingsForm = ({ data, onChange }) => {
  const features = [
    {
      name: 'intelligentCamera',
      label: 'Intelligent Camera System (zoomed-in picture of moving object, AI picture editing)'
    },
    {
      name: 'longBattery',
      label: 'Long-lasting Battery'
    },
    {
      name: 'fastCharging',
      label: 'Fast Charging'
    },
    {
      name: 'slimDesign',
      label: 'Slim & Light Design'
    },
    {
      name: 'durable',
      label: 'Strong/Durable (Dust & Water Resistant)'
    },
    {
      name: 'highDisplay',
      label: 'High-Quality Display (HD) + High Refresh Rate'
    },
    {
      name: 'highPerformance',
      label: 'High Performance & Gaming Experience'
    },
    {
      name: 'aiFeatures',
      label: 'AI Features (AI Camera, AI Assistant Ella)'
    }
  ];

  const handleRatingChange = (name, rating) => {
    const currentRatings = data.featureRatings || {};
    const newRatings = {
      ...currentRatings,
      [name]: rating
    };
    onChange('featureRatings', newRatings);
  };

  return (
    <div className="contact-info-form">
      <div className="feature-rating-section">
        <p className="feature-rating-intro">
          Please rank these features from most important (5) to least important (1).
        </p>
        {features.map((feature) => (
          <StarRating
            key={feature.name}
            label={feature.label}
            name={feature.name}
            value={data.featureRatings?.[feature.name] || 0}
            onChange={(name, rating) => handleRatingChange(name, rating)}
            required={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureRatingsForm;

