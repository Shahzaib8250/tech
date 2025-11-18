import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSurveyStore from '../store/surveyStore';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { resetSurvey } = useSurveyStore();

  const handleStartNewSurvey = () => {
    resetSurvey();
    navigate('/');
  };

  return (
    <div className="thank-you-page animated-bg">
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
      
      <div className="thank-you-container">
        <div className="success-icon">🎉</div>
        <h1>Thank You for Your Feedback!</h1>
        <p className="thank-you-message">
          Your valuable insights have been successfully submitted. We're grateful for your time and honest feedback 
          that will help us improve TECNO's product experience.
        </p>
        
        <div className="next-steps">
          <h3>What Happens Next?</h3>
          <ul>
            <li>Show your completion confirmation to claim your exclusive gift at the TECNO booth</li>
            <li>Join our Facebook fan community for the latest updates on TECNO events and activities</li>
            <li>Stay tuned for exclusive TECNO product launches and updates</li>
            <li>Your feedback will be used to enhance future TECNO experiences</li>
          </ul>
        </div>

        <button className="new-survey-button" onClick={handleStartNewSurvey}>
          <span className="new-survey-button-icon">🚀</span>
          Start Another Survey
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;