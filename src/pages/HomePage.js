import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSurveyStore from '../store/surveyStore';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { startFreshSurvey } = useSurveyStore();
  const [isStarting, setIsStarting] = useState(false);

  // Use form.png for background
  const backgroundImage = `url(${process.env.PUBLIC_URL}/form.png)`;

  const handleStartFeedback = async () => {
    setIsStarting(true);
    try {
      // Start fresh survey (clears any previous data)
      console.log('🆕 Starting fresh survey...');
      const result = startFreshSurvey();
      
      if (result.success) {
        console.log('✅ Fresh survey started successfully');
        navigate('/survey/1');
      } else {
        alert('Failed to start survey. Please try again.');
      }
    } catch (error) {
      console.error('Error starting survey:', error);
      alert('Failed to start survey. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div
      className="homepage animated-bg"
      style={{ backgroundImage }}
    >
      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Elegant Effects */}
      <div className="shimmer"></div>
      <div className="wave"></div>
      
      <div className="homepage-content">
        {/* Single Merged Section */}
        <div className="merged-section">
          {/* Hero Content */}
          <div className="hero-content">
            <h1 className="main-title">Welcome to TECNO SURVEY</h1>
            <p className="subtitle">
              To better understand your needs and improve your product experience, we invite you to take part in this short survey. 
              It will only take 3–5 minutes, and all responses will be used solely for product research.
              Thank you for your time and honest feedback!
            </p>
          </div>

          {/* Call to Action */}
          <div className="cta-content">
            <button 
              className="start-button" 
              onClick={handleStartFeedback}
              disabled={isStarting}
            >
              <span className="start-button-icon">🚀</span>
              {isStarting ? 'Starting Survey...' : 'Start Your Feedback'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;