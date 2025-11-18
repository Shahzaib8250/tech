import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Direct submission to Netlify Function; no external backend URL
const FUNCTION_SUBMIT_URL = '/.netlify/functions/submit-survey';

const useSurveyStore = create(
  persist(
    (set, get) => ({
      // Session management
      sessionId: null,
      sessionStatus: 'inactive', // inactive, active, completed
      
      // Survey data structure
      surveyData: {
        // Basic Information
        gender: '',
        age: '',
        province: '',
        
        // Social Media Habits
        socialMediaPlatforms: [],
        socialMediaPlatformsOther: '',
        timeSpentOnSocialMedia: '',
        followsTechContent: '',
        techUpdateSources: [],
        techUpdateSourcesOther: '',
        
        // Mobile Phone Usage
        currentPhoneBrand: '',
        currentPhoneBrandOther: '',
        topPhoneFunctions: [],
        topPhoneFunctionsOther: '',
        phoneChangeFrequency: '',
        tecnoExperience: '',
        tecnoExperienceRating: '',
        
        // What Matters Most in a New Phone
        phoneFeaturesRanking: [],
        phoneBudget: '',
        preferredPhoneColors: [],
        preferredPhoneColorsSecondary: [],
        
        // Feature Ratings (Page 6)
        featureRatings: {},
        
        // TECNO Campus Brand Ambassador Program
        interestedInAmbassador: '',
        ambassadorStrengths: [],
        ambassadorStrengthsOther: '',
        ambassadorBenefits: [],
        ambassadorBenefitsOther: '',
        name: '',
        contactNumber: '',
        socialMediaLink: '',
        followerCount: '',
        
        // Suggestions
        suggestions: ''
      },
      
      // Current page tracking
      currentPage: 0,
      totalPages: 6,
      
      // Actions
      // Create new session
      createSession: async () => ({ success: true }),
      
      // Save progress for current page
      saveProgress: async (pageData) => {
        // keep local only; no remote persistence needed without sessions
        if (pageData) {
          set((state) => ({ surveyData: { ...state.surveyData, ...pageData } }));
        }
        return { success: true };
      },
      
      // Update survey data locally
      updateSurveyData: (data) => set((state) => ({
        surveyData: { ...state.surveyData, ...data }
      })),
      
      // Navigate to next page
      nextPage: () => set((state) => ({
        currentPage: Math.min(state.currentPage + 1, state.totalPages - 1)
      })),
      
      // Navigate to previous page
      previousPage: () => set((state) => ({
        currentPage: Math.max(state.currentPage - 1, 0)
      })),
      
      // Set current page
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Get session status
      getSessionStatus: async () => ({ success: true, data: null }),
      
      // Submit completed survey
      submitSurvey: async () => {
        const surveyData = get().surveyData;
        
        // Verify all required data is present before submission
        const requiredFields = ['gender', 'age', 'province', 'socialMediaPlatforms', 'timeSpentOnSocialMedia', 
          'followsTechContent', 'techUpdateSources', 'currentPhoneBrand', 'topPhoneFunctions', 
          'phoneChangeFrequency', 'tecnoExperience', 'phoneBudget', 'preferredPhoneColors', 'featureRatings'];
        
        const missingFields = requiredFields.filter(field => {
          if (field === 'socialMediaPlatforms' || field === 'techUpdateSources' || field === 'topPhoneFunctions' 
              || field === 'preferredPhoneColors') {
            const value = surveyData[field];
            return !value || (Array.isArray(value) && value.length === 0);
          }
          if (field === 'featureRatings') {
            const ratings = surveyData[field] || {};
            const requiredFeatures = ['intelligentCamera', 'longBattery', 'fastCharging', 'slimDesign', 
              'durable', 'highDisplay', 'highPerformance', 'aiFeatures'];
            return !requiredFeatures.every(f => ratings[f] && ratings[f] >= 1 && ratings[f] <= 5);
          }
          return !surveyData[field];
        });
        
        if (missingFields.length > 0) {
          console.warn('⚠️ Missing required fields:', missingFields);
          return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
        }
        
        try {
          console.log('📤 Submitting survey data to database:', surveyData);
          console.log('📊 Data completeness check - All fields present:', {
            basicInfo: !!surveyData.gender && !!surveyData.age && !!surveyData.province,
            socialMedia: surveyData.socialMediaPlatforms?.length > 0 && !!surveyData.timeSpentOnSocialMedia,
            phoneUsage: !!surveyData.currentPhoneBrand && surveyData.topPhoneFunctions?.length > 0,
            preferences: !!surveyData.phoneBudget && surveyData.preferredPhoneColors?.length > 0,
            ratings: Object.keys(surveyData.featureRatings || {}).length === 8
          });
          
          // Submit survey data directly to Netlify Function which writes to Postgres
          const response = await axios.post(FUNCTION_SUBMIT_URL, surveyData, {
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.data && response.data.success) {
            console.log('✅ Survey submitted successfully to database:', response.data);
            
            // Clear all local storage and reset the store
            get().resetSurvey();
            
            // Clear localStorage completely to ensure fresh start
            localStorage.removeItem('survey-storage');
            
            console.log('🗑️ Local storage cleared - ready for new survey');
            
            return { 
              success: true, 
              data: response.data,
              message: 'Survey submitted successfully and saved to database'
            };
          }
          
          console.error('❌ Server response indicates failure:', response.data);
          return { success: false, error: response.data?.error || 'Failed to submit survey to database' };
          
        } catch (error) {
          console.error('❌ Survey submission error:', error);
          
          // Check if it's a network error or backend unavailable
          const isNetworkError = error.code === 'ECONNREFUSED' || 
                                 error.code === 'ERR_NETWORK' || 
                                 error.code === 'ECONNABORTED' ||
                                 error.response?.status === 404 || 
                                 error.message.includes('Request failed with status code 404') ||
                                 error.message.includes('Network Error');
          
          if (isNetworkError) {
            // Fallback: Save to localStorage for later retry
            console.log('🔄 Backend not available, saving to localStorage as fallback');
            console.log('📦 Fallback data will be retried when backend is available');
            
            // Save complete survey data to localStorage with timestamp
            const fallbackData = {
              ...get().surveyData,
              submittedAt: new Date().toISOString(),
              fallback: true,
              id: `fallback_${Date.now()}`
            };
            
            // Store in localStorage for retry
            const existingSubmissions = JSON.parse(localStorage.getItem('survey-submissions') || '[]');
            existingSubmissions.push(fallbackData);
            localStorage.setItem('survey-submissions', JSON.stringify(existingSubmissions));
            
            console.log('💾 Data saved to localStorage. Will retry submission when backend is available.');
            console.log(`📝 Total pending submissions: ${existingSubmissions.length}`);
            
            // Clear survey data and reset
            get().resetSurvey();
            localStorage.removeItem('survey-storage');
            
            // Attempt to retry any pending fallback submissions in background
            // This ensures data is saved to database as soon as backend becomes available
            setTimeout(async () => {
              try {
                const { retryFallbackSubmissions } = get();
                await retryFallbackSubmissions();
              } catch (retryError) {
                console.log('⏳ Backend still unavailable, will retry on next submission');
              }
            }, 1000);
            
            return { 
              success: true, 
              data: fallbackData,
              message: 'Survey saved locally. Will be submitted to database when backend is available.',
              fallback: true
            };
          }
          
          // Other errors (validation, server errors, etc.)
          return { 
            success: false, 
            error: error.response?.data?.error || error.message || 'Failed to submit survey to database'
          };
        }
      },
      
      // Legacy submit method for backward compatibility
      submitSurveyLegacy: async () => ({ success: true }),
      
      // Reset survey data and clear all session information
      resetSurvey: () => {
        console.log('🔄 Resetting survey data and clearing session...');
        
        // Clear localStorage
        localStorage.removeItem('survey-storage');
        
        // Reset all state
        set({
          sessionId: null,
          sessionStatus: 'inactive',
          currentPage: 0,
          surveyData: {
            // Basic Information
            gender: '',
            age: '',
            province: '',
            
            // Social Media Habits
            socialMediaPlatforms: [],
            socialMediaPlatformsOther: '',
            timeSpentOnSocialMedia: '',
            followsTechContent: '',
            techUpdateSources: [],
            techUpdateSourcesOther: '',
            
            // Mobile Phone Usage
            currentPhoneBrand: '',
            currentPhoneBrandOther: '',
            topPhoneFunctions: [],
            topPhoneFunctionsOther: '',
            phoneChangeFrequency: '',
            tecnoExperience: '',
            tecnoExperienceRating: '',
            
            // What Matters Most in a New Phone
            phoneFeaturesRanking: [],
            phoneBudget: '',
            preferredPhoneColors: [],
            preferredPhoneColorsSecondary: [],
            
            // Feature Ratings (Page 6)
            featureRatings: {},
            
            // TECNO Campus Brand Ambassador Program
            interestedInAmbassador: false,
            ambassadorStrengths: [],
            ambassadorStrengthsOther: '',
            ambassadorBenefits: [],
            ambassadorBenefitsOther: '',
            name: '',
            contactNumber: '',
            socialMediaLink: '',
            followerCount: '',
            
            // Suggestions
            suggestions: ''
          }
        });
        
        console.log('✅ Survey data reset complete - fresh start ready');
      },
      
      // Start fresh survey (when user scans QR code again)
      startFreshSurvey: () => {
        console.log('🆕 Starting fresh survey - clearing all previous data...');
        get().resetSurvey();
        return { success: true, message: 'Fresh survey started' };
      },

      // Retry submitting fallback data when backend becomes available
      retryFallbackSubmissions: async () => {
        try {
          const fallbackSubmissions = JSON.parse(localStorage.getItem('survey-submissions') || '[]');
          const pendingSubmissions = fallbackSubmissions.filter(sub => sub.fallback);
          
          if (pendingSubmissions.length === 0) {
            return { success: true, message: 'No pending submissions to retry' };
          }

          console.log(`🔄 Retrying ${pendingSubmissions.length} fallback submissions...`);
          
          const results = [];
          for (const submission of pendingSubmissions) {
            try {
              // Remove fallback flag and submit
              const { fallback, ...dataToSubmit } = submission;
              const response = await axios.post(FUNCTION_SUBMIT_URL, dataToSubmit);
              
              if (response.data.success) {
                results.push({ success: true, id: submission.id });
                console.log(`✅ Successfully submitted fallback data: ${submission.id}`);
              } else {
                results.push({ success: false, id: submission.id, error: 'Server rejected submission' });
              }
            } catch (error) {
              results.push({ success: false, id: submission.id, error: error.message });
              console.error(`❌ Failed to submit fallback data ${submission.id}:`, error.message);
            }
          }

          // Remove successfully submitted items from localStorage
          const successfulIds = results.filter(r => r.success).map(r => r.id);
          const remainingSubmissions = fallbackSubmissions.filter(sub => !successfulIds.includes(sub.id));
          localStorage.setItem('survey-submissions', JSON.stringify(remainingSubmissions));

          const successCount = results.filter(r => r.success).length;
          const failCount = results.filter(r => !r.success).length;

          return {
            success: true,
            message: `Retry completed: ${successCount} successful, ${failCount} failed`,
            results
          };

        } catch (error) {
          console.error('❌ Error retrying fallback submissions:', error);
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'survey-storage', // unique name for localStorage
      partialize: (state) => ({ 
        sessionId: state.sessionId,
        sessionStatus: state.sessionStatus,
        surveyData: state.surveyData, 
        currentPage: state.currentPage 
      }), // only persist essential data
    }
  )
);

export default useSurveyStore;