# TECNO TRIBE Survey - Developer Guide

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 14+ and npm 6+
- Git
- Code editor (VS Code recommended)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd technotribe

# Install dependencies
npm install

# Start development server
npm start

# Open browser
# http://localhost:3000
```

### Development Commands

```bash
# Start development server (port 3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Eject configuration (⚠️ irreversible)
npm run eject
```

---

## 📂 File Organization Best Practices

### Component File Structure

```javascript
// ComponentName.js
import React from 'react';
import './ComponentName.css';  // Co-located styles
import { dependency } from 'library';

/**
 * ComponentName - Brief description
 * 
 * @param {Object} props - Component props
 * @param {string} props.propName - Description of prop
 * @returns {JSX.Element}
 */
const ComponentName = ({ propName }) => {
  // State declarations
  const [state, setState] = React.useState(initialValue);
  
  // Effect hooks
  React.useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render logic
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Import Organization

```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party library imports
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// 3. Local component imports
import BasicInfoForm from '../components/forms/BasicInfoForm';
import { Button, Input } from '../components/ui';

// 4. Store/context imports
import useSurveyStore from '../store/surveyStore';

// 5. Asset imports
import { LogoImage } from '../assets';

// 6. Style imports (always last)
import './ComponentName.css';
```

---

## 🧩 Creating New Components

### Step-by-Step: Adding a New Form Page

**Scenario**: Add a "Demographics" page between Basic Info and Social Media

#### 1. Create Form Component

```bash
# Create file
touch src/components/forms/DemographicsForm.js
```

```javascript
// src/components/forms/DemographicsForm.js
import React from 'react';
import { DropdownWithOther, RadioGroup } from '../FormComponents';

const DemographicsForm = ({ data, onChange }) => {
  const ageRanges = [
    { value: '18-20', label: '18-20 years' },
    { value: '21-23', label: '21-23 years' },
    { value: '24-26', label: '24-26 years' },
    { value: '27-plus', label: '27+ years' }
  ];

  const residenceTypes = [
    { value: 'hostel', label: 'University Hostel' },
    { value: 'family', label: 'With Family' },
    { value: 'private', label: 'Private Accommodation' }
  ];

  return (
    <div className="demographics-form">
      <DropdownWithOther
        label="Age Range"
        name="ageRange"
        options={ageRanges}
        value={data.ageRange}
        onChange={onChange}
        placeholder="Select your age range"
        required={true}
      />

      <RadioGroup
        label="Current Residence"
        name="residenceType"
        options={residenceTypes}
        value={data.residenceType}
        onChange={onChange}
        required={true}
      />
    </div>
  );
};

export default DemographicsForm;
```

#### 2. Update Zustand Store

```javascript
// src/store/surveyStore.js

const useSurveyStore = create(
  persist(
    (set, get) => ({
      surveyData: {
        // ... existing fields ...
        
        // Add new fields
        ageRange: '',
        residenceType: '',
      },
      
      // Update total pages
      currentPage: 0,
      totalPages: 9, // Changed from 8 to 9
      
      // In resetSurvey(), add fields to reset object
      resetSurvey: () => {
        set({
          surveyData: {
            // ... existing resets ...
            ageRange: '',
            residenceType: '',
          }
        });
      }
    }),
    {
      name: 'survey-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionStatus: state.sessionStatus,
        surveyData: state.surveyData, // New fields auto-included
        currentPage: state.currentPage
      }),
    }
  )
);
```

#### 3. Update SurveyPage

```javascript
// src/pages/SurveyPage.js

// Add import
import DemographicsForm from '../components/forms/DemographicsForm';

// Update page titles
const pageTitles = [
  'Basic Information',
  'Demographics',              // NEW
  'Social Media Habits',       // Shifted down
  'Mobile Phone Usage',
  'Skills & Work',
  'What Matters Most in a New Phone',
  'TECNO Campus Brand Ambassador Program',
  'Contact Information',
  'Suggestions'
];

// Add validation
const isPageValid = () => {
  switch (currentPage) {
    case 0: {
      // Basic Information validation (unchanged)
    }
    case 1: {
      // NEW: Demographics validation
      const { ageRange, residenceType } = surveyData;
      return !!(ageRange && residenceType);
    }
    case 2: {
      // Social Media validation (previously case 1)
    }
    // ... adjust all subsequent cases +1
  }
};

// Add to renderForm
const renderForm = () => {
  switch (currentPage) {
    case 0:
      return <BasicInfoForm data={surveyData} onChange={handleDataChange} />;
    case 1:
      return <DemographicsForm data={surveyData} onChange={handleDataChange} />;
    case 2:
      return <SocialMediaForm data={surveyData} onChange={handleDataChange} />;
    // ... rest of forms
  }
};
```

#### 4. Update Navigation Logic

```javascript
// Update special navigation logic if needed
const handleNext = async () => {
  if (currentPage < 8) {  // Changed from 7 to 8
    if (!isPageValid()) {
      alert('Please complete all required fields before continuing.');
      return;
    }
    
    // Ambassador skip logic (now page 6 instead of 5)
    if (currentPage === 6 && surveyData.interestedInAmbassador !== 'yes') {
      navigate('/survey/9');  // Skip to page 9 (was 8)
      return;
    }
    
    await saveProgress();
    navigate(`/survey/${currentPage + 2}`);
  }
};
```

#### 5. Test Your Changes

```bash
# Start dev server
npm start

# Test flow:
# 1. Fill Basic Info → Next
# 2. Fill Demographics → Next
# 3. Verify data persists in localStorage
# 4. Refresh page → Data should remain
# 5. Complete survey → Submission includes new fields
```

---

## 🎨 Styling Guidelines

### CSS Naming Convention

Use BEM (Block Element Modifier) style:

```css
/* Block */
.demographics-form {
  padding: 20px;
}

/* Element */
.demographics-form__field {
  margin-bottom: 15px;
}

/* Modifier */
.demographics-form__field--required {
  border-left: 3px solid red;
}
```

### Responsive Design Patterns

```css
/* Mobile-first approach */
.component {
  width: 100%;
  padding: 10px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .component {
    width: 80%;
    padding: 20px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component {
    width: 60%;
    padding: 30px;
  }
}
```

### Color Variables (Add to index.css)

```css
:root {
  --primary-color: #00A8E8;      /* TECNO Blue */
  --secondary-color: #003B5C;     /* Dark Blue */
  --accent-color: #FFC107;        /* Amber */
  --text-primary: #333333;        /* Dark Gray */
  --text-secondary: #666666;      /* Medium Gray */
  --background-light: #F5F5F5;    /* Light Gray */
  --border-color: #DDDDDD;        /* Border Gray */
  --error-color: #D32F2F;         /* Red */
  --success-color: #388E3C;       /* Green */
}
```

---

## 🔧 Zustand Store Patterns

### Reading State

```javascript
// Get entire store (re-renders on any change)
const store = useSurveyStore();

// Get specific values (re-renders only when these change)
const surveyData = useSurveyStore(state => state.surveyData);
const currentPage = useSurveyStore(state => state.currentPage);

// Get multiple values
const { surveyData, currentPage, updateSurveyData } = useSurveyStore(
  state => ({
    surveyData: state.surveyData,
    currentPage: state.currentPage,
    updateSurveyData: state.updateSurveyData
  })
);

// Best practice: Only select what you need
const gender = useSurveyStore(state => state.surveyData.gender);
```

### Updating State

```javascript
// Simple update
updateSurveyData({ gender: 'male' });

// Update multiple fields
updateSurveyData({
  gender: 'male',
  yearOfStudy: 'third-year',
  university: 'uol'
});

// Update array field
updateSurveyData({
  socialMediaPlatforms: [...surveyData.socialMediaPlatforms, 'twitter']
});

// Update nested object
updateSurveyData({
  phoneFeaturesRanking: {
    ...surveyData.phoneFeaturesRanking,
    'intelligent-camera': '1'
  }
});
```

### Creating Custom Actions

```javascript
// In surveyStore.js
const useSurveyStore = create(
  persist(
    (set, get) => ({
      surveyData: { /* ... */ },
      
      // Custom action: Clear specific section
      clearSection: (sectionName) => {
        const fieldsToReset = getSectionFields(sectionName);
        const resetData = fieldsToReset.reduce((acc, field) => {
          acc[field] = Array.isArray(get().surveyData[field]) ? [] : '';
          return acc;
        }, {});
        
        set((state) => ({
          surveyData: { ...state.surveyData, ...resetData }
        }));
      },
      
      // Custom action: Validate entire survey
      validateAllPages: () => {
        const errors = [];
        for (let i = 0; i < get().totalPages; i++) {
          const pageError = validatePage(i, get().surveyData);
          if (pageError) errors.push({ page: i, error: pageError });
        }
        return errors;
      },
      
      // Custom action: Export data as JSON
      exportData: () => {
        const data = get().surveyData;
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `survey-${Date.now()}.json`;
        link.click();
      }
    }),
    { /* persist config */ }
  )
);
```

---

## 🧪 Testing Guide

### Unit Testing Form Components

```javascript
// src/components/forms/__tests__/BasicInfoForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BasicInfoForm from '../BasicInfoForm';

describe('BasicInfoForm', () => {
  const mockData = {
    gender: '',
    yearOfStudy: '',
    fieldOfStudy: '',
    university: ''
  };
  
  const mockOnChange = jest.fn();
  
  test('renders all form fields', () => {
    render(<BasicInfoForm data={mockData} onChange={mockOnChange} />);
    
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Year of Study')).toBeInTheDocument();
    expect(screen.getByText('Field of Study')).toBeInTheDocument();
    expect(screen.getByText('University')).toBeInTheDocument();
  });
  
  test('calls onChange when field changes', () => {
    render(<BasicInfoForm data={mockData} onChange={mockOnChange} />);
    
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('gender', 'male');
  });
  
  test('displays pre-filled data correctly', () => {
    const filledData = { ...mockData, gender: 'female' };
    render(<BasicInfoForm data={filledData} onChange={mockOnChange} />);
    
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    expect(genderSelect.value).toBe('female');
  });
});
```

### Integration Testing Survey Flow

```javascript
// src/pages/__tests__/SurveyPage.integration.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import SurveyPage from '../SurveyPage';
import useSurveyStore from '../../store/surveyStore';

// Mock the store
jest.mock('../../store/surveyStore');

describe('SurveyPage Integration', () => {
  beforeEach(() => {
    // Reset store mock before each test
    useSurveyStore.mockReturnValue({
      surveyData: {
        gender: '',
        yearOfStudy: '',
        // ... other fields
      },
      updateSurveyData: jest.fn(),
      saveProgress: jest.fn(),
      submitSurvey: jest.fn()
    });
  });
  
  test('validates required fields before navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/survey/1']}>
        <SurveyPage />
      </MemoryRouter>
    );
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    // Alert should show for missing fields
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
  
  test('navigates to next page when valid', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    useSurveyStore.mockReturnValue({
      surveyData: {
        gender: 'male',
        yearOfStudy: 'third-year',
        fieldOfStudy: 'engineering',
        university: 'uol'
      },
      updateSurveyData: jest.fn(),
      saveProgress: jest.fn().mockResolvedValue({ success: true })
    });
    
    render(
      <MemoryRouter initialEntries={['/survey/1']}>
        <SurveyPage />
      </MemoryRouter>
    );
    
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/survey/2');
    });
  });
});
```

### E2E Testing with Cypress

```javascript
// cypress/integration/survey_flow.spec.js
describe('Complete Survey Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });
  
  it('completes full survey successfully', () => {
    // HomePage
    cy.contains('Start Feedback').click();
    
    // Page 1: Basic Information
    cy.get('select[name="gender"]').select('Male');
    cy.get('select[name="yearOfStudy"]').select('Third Year');
    cy.get('select[name="fieldOfStudy"]').select('Engineering');
    cy.get('select[name="university"]').select('University of Lahore');
    cy.contains('Next').click();
    
    // Page 2: Social Media Habits
    cy.get('input[value="instagram"]').check();
    cy.get('input[value="tiktok"]').check();
    cy.get('select[name="timeSpentOnSocialMedia"]').select('2-3 hours');
    cy.get('select[name="followsTechContent"]').select('Often');
    cy.get('input[value="influencers"]').check();
    cy.contains('Next').click();
    
    // ... continue for all pages ...
    
    // Final page: Submit
    cy.contains('Submit').click();
    
    // Verify thank you page
    cy.url().should('include', '/thank-you');
    cy.contains('Thank You!').should('be.visible');
  });
  
  it('persists data on page refresh', () => {
    cy.contains('Start Feedback').click();
    
    // Fill some data
    cy.get('select[name="gender"]').select('Female');
    cy.get('select[name="yearOfStudy"]').select('Second Year');
    
    // Refresh page
    cy.reload();
    
    // Data should persist
    cy.get('select[name="gender"]').should('have.value', 'female');
    cy.get('select[name="yearOfStudy"]').should('have.value', 'second-year');
  });
});
```

---

## 🔌 API Integration

### Backend Endpoint Specification

**Expected Backend Endpoint**: `/.netlify/functions/submit-survey`

#### Request

```http
POST /.netlify/functions/submit-survey
Content-Type: application/json

{
  "gender": "male",
  "yearOfStudy": "third-year",
  "fieldOfStudy": "engineering",
  "fieldOfStudyOther": "",
  "university": "uol",
  "universityOther": "",
  "socialMediaPlatforms": ["instagram", "tiktok"],
  "socialMediaPlatformsOther": "",
  "timeSpentOnSocialMedia": "2-3-hours",
  "followsTechContent": "often",
  "techUpdateSources": ["influencers", "tech-websites"],
  "techUpdateSourcesOther": "",
  "currentPhoneBrand": "samsung",
  "currentPhoneBrandOther": "",
  "topPhoneFunctions": ["camera-video", "social-media", "communication"],
  "topPhoneFunctionsOther": "",
  "phoneChangeFrequency": "1-2-years",
  "tecnoExperience": "heard-of",
  "tecnoExperienceRating": "",
  "learningSkills": ["web-development", "programming"],
  "learningSkillsOther": "",
  "partTimeWork": ["none"],
  "partTimeWorkOther": "",
  "phoneFeaturesRanking": {
    "intelligent-camera": "1",
    "long-battery": "2",
    "fast-charging": "3",
    "slim-design": "4",
    "durable": "5",
    "high-display": "6",
    "high-performance": "7",
    "ai-features": "8"
  },
  "phoneBudget": "46-60k",
  "preferredPhoneColors": ["wisteria-purple", "sea-green"],
  "interestedInAmbassador": "yes",
  "ambassadorStrengths": ["large-social-circle", "content-creation"],
  "ambassadorStrengthsOther": "",
  "ambassadorBenefits": ["free-trial", "merchandise"],
  "ambassadorBenefitsOther": "",
  "name": "John Doe",
  "contactNumber": "+923001234567",
  "socialMediaPlatform": "instagram",
  "socialMediaPlatformOther": "",
  "socialMediaLink": "https://instagram.com/johndoe",
  "followerCount": "1000-5000",
  "suggestions": "Great survey!"
}
```

#### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "id": 12345,
    "timestamp": "2024-01-15T10:30:00Z",
    "submissionId": "TECNO-2024-12345"
  }
}
```

#### Error Response

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "contactNumber",
    "message": "Invalid phone number format"
  }
}
```

### Sample Netlify Function

```javascript
// netlify/functions/submit-survey.js
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Parse request body
    const surveyData = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['gender', 'yearOfStudy', 'fieldOfStudy', 'university'];
    for (const field of requiredFields) {
      if (!surveyData[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: 'Validation failed',
            details: { field, message: `${field} is required` }
          })
        };
      }
    }
    
    // Insert into database
    const query = `
      INSERT INTO survey_responses (
        gender, year_of_study, field_of_study, university,
        social_media_platforms, time_spent_on_social_media,
        -- ... all other fields ...
        submitted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW()
      ) RETURNING id
    `;
    
    const values = [
      surveyData.gender,
      surveyData.yearOfStudy,
      surveyData.fieldOfStudy,
      surveyData.university,
      JSON.stringify(surveyData.socialMediaPlatforms),
      surveyData.timeSpentOnSocialMedia,
      // ... all other values ...
    ];
    
    const result = await pool.query(query, values);
    const insertedId = result.rows[0].id;
    
    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Survey submitted successfully',
        data: {
          id: insertedId,
          timestamp: new Date().toISOString(),
          submissionId: `TECNO-2024-${insertedId}`
        }
      })
    };
    
  } catch (error) {
    console.error('Survey submission error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
```

### Database Schema

```sql
-- PostgreSQL schema for survey responses
CREATE TABLE survey_responses (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- Basic Information
  gender VARCHAR(50) NOT NULL,
  year_of_study VARCHAR(50) NOT NULL,
  field_of_study VARCHAR(100) NOT NULL,
  field_of_study_other TEXT,
  university VARCHAR(100) NOT NULL,
  university_other TEXT,
  
  -- Social Media Habits
  social_media_platforms JSONB NOT NULL,
  social_media_platforms_other TEXT,
  time_spent_on_social_media VARCHAR(50) NOT NULL,
  follows_tech_content VARCHAR(50) NOT NULL,
  tech_update_sources JSONB NOT NULL,
  tech_update_sources_other TEXT,
  
  -- Mobile Phone Usage
  current_phone_brand VARCHAR(50) NOT NULL,
  current_phone_brand_other TEXT,
  top_phone_functions JSONB NOT NULL,
  top_phone_functions_other TEXT,
  phone_change_frequency VARCHAR(50) NOT NULL,
  tecno_experience VARCHAR(50) NOT NULL,
  tecno_experience_rating VARCHAR(50),
  
  -- Skills & Work
  learning_skills JSONB NOT NULL,
  learning_skills_other TEXT,
  part_time_work JSONB NOT NULL,
  part_time_work_other TEXT,
  
  -- Phone Preferences
  phone_features_ranking JSONB NOT NULL,
  phone_budget VARCHAR(50) NOT NULL,
  preferred_phone_colors JSONB NOT NULL,
  
  -- Ambassador Program
  interested_in_ambassador VARCHAR(50),
  ambassador_strengths JSONB,
  ambassador_strengths_other TEXT,
  ambassador_benefits JSONB,
  ambassador_benefits_other TEXT,
  
  -- Contact Information
  name VARCHAR(255),
  contact_number VARCHAR(50),
  social_media_platform VARCHAR(50),
  social_media_platform_other TEXT,
  social_media_link TEXT,
  follower_count VARCHAR(50),
  
  -- Suggestions
  suggestions TEXT,
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  -- Indexes
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_university (university),
  INDEX idx_interested_ambassador (interested_in_ambassador)
);

-- Create view for ambassador candidates
CREATE VIEW ambassador_candidates AS
SELECT 
  id,
  name,
  contact_number,
  social_media_platform,
  social_media_link,
  follower_count,
  ambassador_strengths,
  ambassador_benefits,
  submitted_at
FROM survey_responses
WHERE interested_in_ambassador = 'yes';

-- Create analytics view
CREATE VIEW survey_analytics AS
SELECT
  COUNT(*) as total_responses,
  COUNT(CASE WHEN interested_in_ambassador = 'yes' THEN 1 END) as ambassador_interested,
  jsonb_object_agg(gender, gender_count) as gender_distribution,
  jsonb_object_agg(university, uni_count) as university_distribution
FROM (
  SELECT 
    gender,
    university,
    COUNT(*) OVER (PARTITION BY gender) as gender_count,
    COUNT(*) OVER (PARTITION BY university) as uni_count
  FROM survey_responses
) sub;
```

---

## 🐛 Debugging Tips

### Common Issues & Solutions

#### Issue 1: "State not persisting"
**Symptoms**: Data lost on refresh
**Debug**:
```javascript
// Check localStorage
console.log(localStorage.getItem('survey-storage'));

// Check if persist middleware is active
console.log(useSurveyStore.persist);
```
**Solutions**:
- Verify localStorage is enabled in browser
- Check if private/incognito mode is blocking storage
- Ensure partialize config is correct

#### Issue 2: "Validation not working"
**Symptoms**: Can proceed with empty fields
**Debug**:
```javascript
// Add logging in isPageValid
const isPageValid = () => {
  const result = /* validation logic */;
  console.log('Page', currentPage, 'valid:', result);
  console.log('surveyData:', surveyData);
  return result;
};
```
**Solutions**:
- Verify field names match between form and validation
- Check for typos in field names
- Ensure data is actually in store

#### Issue 3: "onChange not firing"
**Symptoms**: Typing doesn't update state
**Debug**:
```javascript
const handleDataChange = (fieldName, value) => {
  console.log('onChange:', fieldName, value);
  updateSurveyData({ [fieldName]: value });
};
```
**Solutions**:
- Check props are passed correctly: `onChange={handleDataChange}`
- Verify FormComponent is calling `props.onChange(name, value)`
- Ensure name prop matches field name

#### Issue 4: "Submit failing silently"
**Symptoms**: Submit button clicked, nothing happens
**Debug**:
```javascript
const handleSubmit = async () => {
  console.log('Submit clicked');
  console.log('isSubmitting:', isSubmitting);
  console.log('isValid:', isPageValid());
  
  try {
    const result = await submitSurvey();
    console.log('Submit result:', result);
  } catch (error) {
    console.error('Submit error:', error);
  }
};
```
**Solutions**:
- Check network tab for failed requests
- Verify backend endpoint exists
- Check console for JavaScript errors
- Ensure isSubmitting state is managed correctly

### Browser DevTools Tips

```javascript
// Access store from console
window.store = useSurveyStore;

// Get current state
store.getState();

// Manually update state
store.getState().updateSurveyData({ gender: 'test' });

// Reset survey
store.getState().resetSurvey();

// Check localStorage size
console.log(
  'Storage size:',
  new Blob([localStorage.getItem('survey-storage')]).size,
  'bytes'
);
```

---

## 📊 Performance Optimization

### Code Splitting

```javascript
// Lazy load form components
import React, { lazy, Suspense } from 'react';

const BasicInfoForm = lazy(() => import('../components/forms/BasicInfoForm'));
const SocialMediaForm = lazy(() => import('../components/forms/SocialMediaForm'));
// ... other forms

const renderForm = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {currentPage === 0 && <BasicInfoForm data={surveyData} onChange={handleDataChange} />}
      {currentPage === 1 && <SocialMediaForm data={surveyData} onChange={handleDataChange} />}
      {/* ... */}
    </Suspense>
  );
};
```

### Memoization

```javascript
import React, { useMemo, useCallback } from 'react';

const SurveyPage = () => {
  // Memoize expensive calculations
  const progressPercentage = useMemo(() => {
    return Math.round((currentPage / totalPages) * 100);
  }, [currentPage, totalPages]);
  
  // Memoize callback functions
  const handleDataChange = useCallback((fieldName, value) => {
    updateSurveyData({ [fieldName]: value });
  }, [updateSurveyData]);
  
  // Memoize form component
  const formComponent = useMemo(() => {
    return renderForm();
  }, [currentPage, surveyData]);
  
  return (
    <div>
      <ProgressBar percentage={progressPercentage} />
      {formComponent}
    </div>
  );
};
```

### Debouncing Updates

```javascript
import { debounce } from 'lodash';

const debouncedUpdate = debounce((fieldName, value) => {
  updateSurveyData({ [fieldName]: value });
}, 300);

const handleTextInput = (fieldName, value) => {
  // Update UI immediately (optimistic)
  setLocalValue(value);
  
  // Update store with debounce
  debouncedUpdate(fieldName, value);
};
```

---

## 🔐 Security Best Practices

### Input Sanitization

```javascript
import DOMPurify from 'dompurify';

const sanitizeInput = (value) => {
  if (typeof value === 'string') {
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
  }
  return value;
};

const handleDataChange = (fieldName, value) => {
  const sanitizedValue = sanitizeInput(value);
  updateSurveyData({ [fieldName]: sanitizedValue });
};
```

### Rate Limiting (Backend)

```javascript
// netlify/functions/submit-survey.js
const rateLimit = new Map();

const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  const requests = rateLimit.get(ip).filter(time => now - time < windowMs);
  
  if (requests.length >= maxRequests) {
    return false; // Rate limited
  }
  
  requests.push(now);
  rateLimit.set(ip, requests);
  return true;
};

exports.handler = async (event) => {
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'];
  
  if (!checkRateLimit(ip)) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  
  // ... rest of handler
};
```

### Environment Variables

```javascript
// .env (DO NOT COMMIT)
REACT_APP_API_URL=https://api.example.com
REACT_APP_ANALYTICS_ID=UA-123456-1

// Access in code
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## 📦 Deployment Checklist

### Pre-Deployment

- [ ] Run all tests: `npm test`
- [ ] Check for console errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify all forms validate correctly
- [ ] Test complete survey flow
- [ ] Check localStorage persistence
- [ ] Verify fallback mechanism works
- [ ] Review performance (Lighthouse audit)
- [ ] Check accessibility (axe DevTools)
- [ ] Update version number in package.json
- [ ] Update README.md if needed

### Build Process

```bash
# Create production build
npm run build

# Test production build locally
npx serve -s build

# Check build size
du -sh build/
```

### Netlify Deployment

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Add environment variables if needed
4. Enable automatic deployments on push
5. Configure custom domain (if applicable)

### Post-Deployment

- [ ] Verify site loads correctly
- [ ] Test complete survey flow on live site
- [ ] Check analytics tracking
- [ ] Monitor error logs
- [ ] Test on various devices/browsers
- [ ] Verify SSL certificate is active
- [ ] Test backend API integration
- [ ] Check performance metrics

---

## 🔄 Git Workflow

### Branch Strategy

```bash
# Main branches
main        # Production-ready code
develop     # Development branch

# Feature branches
feature/demographics-page
feature/analytics-dashboard
feature/backend-integration

# Bugfix branches
bugfix/validation-issue
bugfix/storage-quota

# Hotfix branches (urgent production fixes)
hotfix/submission-error
```

### Commit Message Convention

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting, etc.)
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks

# Examples:
git commit -m "feat(survey): add demographics page"
git commit -m "fix(validation): correct phone number validation"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(store): optimize state updates"
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Added tests (if applicable)

## Screenshots (if applicable)
![Screenshot](url)

## Related Issues
Closes #123
```

---

**End of Developer Guide**

*Last Updated: [Current Date]*
*Version: 1.0*



