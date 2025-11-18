import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSurveyStore from '../store/surveyStore';
import BasicInfoForm from '../components/forms/BasicInfoForm';
import SocialMediaForm from '../components/forms/SocialMediaForm';
import MobileUsageForm from '../components/forms/MobileUsageForm';
import PhonePreferencesForm from '../components/forms/PhonePreferencesForm';
import FeatureRatingsForm from '../components/forms/FeatureRatingsForm';
import ContactInfoForm from '../components/forms/ContactInfoForm';
import './SurveyPage.css';

const SurveyPage = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) - 1; // Convert to 0-based index
  const { surveyData, updateSurveyData, submitSurvey, saveProgress, retryFallbackSubmissions } = useSurveyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user tries to access pages beyond 5 or invalid pages
  useEffect(() => {
    if (currentPage > 5 || currentPage < 0 || isNaN(currentPage)) {
      // Redirect to last valid page (page 5, which is /survey/6)
      navigate('/survey/6');
    }
  }, [currentPage, navigate]);

  // Attempt to retry any pending fallback submissions when component mounts
  useEffect(() => {
    const retryPendingSubmissions = async () => {
      try {
        const result = await retryFallbackSubmissions();
        if (result.results && result.results.some(r => r.success)) {
          console.log('✅ Successfully submitted pending fallback data to database');
        }
      } catch (error) {
        // Silently fail - backend might still be unavailable
        console.log('⏳ Backend unavailable, will retry on next submission');
      }
    };
    
    // Retry after a short delay to ensure component is fully loaded
    const timer = setTimeout(retryPendingSubmissions, 2000);
    return () => clearTimeout(timer);
  }, [retryFallbackSubmissions]);

  // Use form.png for background
  const backgroundImage = `url(${process.env.PUBLIC_URL}/form.png)`;

  const pageTitles = [
    'Basic Information',
    'Social Media Habits', 
    'Mobile Phone Usage',
    'What Matters Most in a New Phone',
    'Feature Ratings',
    'Stay Connected'
  ];

  const handleDataChange = (fieldName, value) => {
    updateSurveyData({ [fieldName]: value });
  };

  const isPageValid = () => {
    // Validate required fields per page. Only interestedInAmbassador and Suggestions are optional.
    switch (currentPage) {
      case 0: {
        const { gender, age, province } = surveyData;
        return !!(gender && age && province);
      }
      case 1: {
        const { socialMediaPlatforms = [], timeSpentOnSocialMedia, followsTechContent, techUpdateSources = [] } = surveyData;
        return socialMediaPlatforms.length > 0 && !!timeSpentOnSocialMedia && !!followsTechContent && techUpdateSources.length > 0;
      }
      case 2: {
        const { currentPhoneBrand, topPhoneFunctions = [], phoneChangeFrequency, tecnoExperience, tecnoExperienceRating } = surveyData;
        const baseOk = !!currentPhoneBrand && topPhoneFunctions.length > 0 && topPhoneFunctions.length <= 3 && !!phoneChangeFrequency && !!tecnoExperience;
        const ratingOk = tecnoExperience !== 'yes-used' || !!tecnoExperienceRating;
        return baseOk && ratingOk;
      }
      case 3: {
        const { phoneBudget, preferredPhoneColors = [], preferredPhoneColorsSecondary = [] } = surveyData;
        return !!phoneBudget && preferredPhoneColors.length > 0 && preferredPhoneColorsSecondary.length > 0;
      }
      case 4: {
        // All 8 features must be rated (1-5)
        const { featureRatings = {} } = surveyData;
        const requiredFeatures = ['intelligentCamera', 'longBattery', 'fastCharging', 'slimDesign', 'durable', 'highDisplay', 'highPerformance', 'aiFeatures'];
        const allRated = requiredFeatures.every(feature => {
          const rating = featureRatings[feature];
          return rating && rating >= 1 && rating <= 5;
        });
        return allRated;
      }
      case 5: {
        const { contactNumber } = surveyData;
        return !!contactNumber;
      }
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save final progress before submitting
      if (!isPageValid()) {
        alert('Please complete all required fields before submitting.');
        setIsSubmitting(false);
        return;
      }
      await saveProgress();
      
      const result = await submitSurvey();
      if (result.success) {
        // Data saved successfully (either to backend or localStorage fallback)
        // Silently navigate to thank you page without showing alert
        navigate('/thank-you');
      } else {
        alert(`Error submitting survey: ${result.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      alert(`Error submitting survey: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    // If on last page (page 5), submit the form
    if (currentPage === 5) {
      await handleSubmit();
      return;
    }
    
    if (currentPage < 5) {
      if (!isPageValid()) {
        alert('Please complete all required fields before continuing.');
        return;
      }
      
      // Save progress before navigating
      try {
        await saveProgress();
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
      navigate(`/survey/${currentPage + 2}`);
    }
  };


  const handlePrevious = () => {
    if (currentPage > 0) {
      navigate(`/survey/${currentPage}`);
    } else {
      navigate('/');
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case 0:
        return <BasicInfoForm data={surveyData} onChange={handleDataChange} />;
      case 1:
        return <SocialMediaForm data={surveyData} onChange={handleDataChange} />;
      case 2:
        return <MobileUsageForm data={surveyData} onChange={handleDataChange} />;
      case 3:
        return <PhonePreferencesForm data={surveyData} onChange={handleDataChange} />;
      case 4:
        return <FeatureRatingsForm data={surveyData} onChange={handleDataChange} />;
      case 5:
        return <ContactInfoForm data={surveyData} onChange={handleDataChange} />;
      default:
        return <div>Page not found</div>;
    }
  };

  const isLastPage = currentPage === 5;
  // eslint-disable-next-line no-unused-vars
  const isFirstPage = currentPage === 0;

  // Calculate progress percentage
  const progressPercentage = ((currentPage + 1) / 6) * 100;

  return (
    <div className="survey-page animated-bg" style={{ backgroundImage }}>
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
      
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar-wrapper">
          <div className="progress-info">
            <span>Step {currentPage + 1} of 6</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="survey-content">
        <div className="form-container">
          <h2 className="section-title">{pageTitles[currentPage]}</h2>
          {renderForm()}
          
          {/* Inline Navigation Buttons */}
          <div className="inline-navigation">
            <button 
              className="nav-button"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              ← Back
            </button>
            
            <button 
              className={`nav-button ${isSubmitting ? 'submitting' : ''}`}
              onClick={isLastPage ? handleSubmit : handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (isLastPage ? '✓ Submit' : 'Next →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
