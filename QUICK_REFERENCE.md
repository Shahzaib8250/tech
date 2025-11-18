# TECNO TRIBE Survey - Quick Reference Guide

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Files](#key-files)
- [Common Commands](#common-commands)
- [Data Structure](#data-structure)
- [Form Components](#form-components)
- [Validation Rules](#validation-rules)
- [Store Actions](#store-actions)
- [Navigation Logic](#navigation-logic)
- [API Format](#api-format)
- [Debugging](#debugging)

---

## 🎯 Project Overview

**Purpose**: Campus survey for TECNO mobile phones  
**Tech Stack**: React 19, Zustand, React Router, Axios  
**Pages**: 8 survey pages (HomePage → 8 forms → ThankYou)  
**Data Storage**: localStorage (Zustand persist)  
**Backend**: Netlify Functions + PostgreSQL

---

## 📁 Key Files

```
Essential files you'll work with most:

📄 src/store/surveyStore.js
   → Zustand store (state management)
   → All survey data and actions

📄 src/pages/SurveyPage.js
   → Main survey container
   → Validation logic
   → Navigation handlers

📄 src/components/FormComponents.js
   → Reusable form inputs
   → Dropdown, TextInput, CheckboxGroup, etc.

📄 src/components/forms/[PageName]Form.js
   → Individual page forms
   → 8 files (BasicInfoForm, SocialMediaForm, etc.)

📄 src/App.js
   → Root component with routing

📄 public/_redirects
   → Netlify redirect rules for SPA
```

---

## ⚡ Common Commands

```bash
# Development
npm start                    # Start dev server (localhost:3000)
npm test                     # Run tests
npm run build                # Build for production

# Debugging
localStorage.getItem('survey-storage')       # Check saved data
localStorage.clear()                          # Clear all data
useSurveyStore.getState().surveyData         # Get current state
useSurveyStore.getState().resetSurvey()      # Reset survey
```

---

## 📊 Data Structure

### surveyData Object (in Zustand store)

```javascript
{
  // Page 1: Basic Information
  gender: '',                      // 'male' | 'female' | 'prefer-not-to-say'
  yearOfStudy: '',                 // 'first-year' | 'second-year' | etc.
  fieldOfStudy: '',                // 'liberal-arts' | 'science' | etc.
  fieldOfStudyOther: '',           // Text if 'other' selected
  university: '',                  // 'uol' | 'ucp' | etc.
  universityOther: '',             // Text if 'other' selected
  
  // Page 2: Social Media Habits
  socialMediaPlatforms: [],        // Array: ['facebook', 'instagram', ...]
  socialMediaPlatformsOther: '',
  timeSpentOnSocialMedia: '',      // '0-1-hour' | '2-3-hours' | etc.
  followsTechContent: '',          // 'often' | 'sometimes' | etc.
  techUpdateSources: [],           // Array: ['influencers', 'friends', ...]
  techUpdateSourcesOther: '',
  
  // Page 3: Mobile Phone Usage
  currentPhoneBrand: '',           // 'apple' | 'samsung' | etc.
  currentPhoneBrandOther: '',
  topPhoneFunctions: [],           // Array (exactly 3)
  topPhoneFunctionsOther: '',
  phoneChangeFrequency: '',        // 'less-than-1-year' | etc.
  tecnoExperience: '',             // 'yes-used' | 'heard-of' | etc.
  tecnoExperienceRating: '',       // Only if tecnoExperience === 'yes-used'
  
  // Page 4: Skills & Work
  learningSkills: [],              // Array
  learningSkillsOther: '',
  partTimeWork: [],                // Array
  partTimeWorkOther: '',
  
  // Page 5: Phone Preferences
  phoneFeaturesRanking: {},        // Object: { 'feature': '1', ... }
  phoneBudget: '',                 // '20-30k' | '31-45k' | etc.
  preferredPhoneColors: [],        // Array: ['amazon-green', ...]
  
  // Page 6: Ambassador Program (optional)
  interestedInAmbassador: '',      // 'yes' | 'skipped' | ''
  ambassadorStrengths: [],         // Only if interested
  ambassadorStrengthsOther: '',
  ambassadorBenefits: [],          // Only if interested
  ambassadorBenefitsOther: '',
  
  // Page 7: Contact Information (only if interested in ambassador)
  name: '',
  contactNumber: '',
  socialMediaPlatform: '',
  socialMediaPlatformOther: '',
  socialMediaLink: '',             // Optional
  followerCount: '',
  
  // Page 8: Suggestions (optional)
  suggestions: ''
}
```

---

## 🧩 Form Components Reference

### Component Usage Examples

```javascript
// Single Select Dropdown
<DropdownWithOther
  label="Question text"
  name="fieldName"
  options={[{ value: 'val', label: 'Label' }]}
  value={data.fieldName}
  onChange={onChange}
  placeholder="Select..."
  required={true}
  otherFieldName="fieldNameOther"  // If "other" option exists
  otherValue={data.fieldNameOther}
/>

// Multi-Select Checkboxes
<MultiDropdownWithOther
  label="Question text"
  name="fieldName"
  options={[{ value: 'val', label: 'Label' }]}
  values={data.fieldName || []}     // Array, not string
  onChange={onChange}
  maxSelections={3}                 // Optional limit
  otherFieldName="fieldNameOther"
  otherValue={data.fieldNameOther}
/>

// Text Input
<TextInput
  label="Question text"
  name="fieldName"
  value={data.fieldName || ''}
  onChange={onChange}
  placeholder="Enter..."
  type="text"                       // or "tel", "url", "email"
  required={true}
/>

// Textarea
<Textarea
  label="Question text"
  name="fieldName"
  value={data.fieldName || ''}
  onChange={onChange}
  placeholder="Enter..."
  rows={6}
  required={false}
/>

// Ranking (1-8)
<RankingComponent
  label="Rank these features from 1 to 8"
  name="fieldName"
  options={[{ value: 'val', label: 'Label' }]}
  rankings={data.fieldName || {}}   // Object, not array
  onChange={onChange}
/>

// Color Picker
<ColorPicker
  label="Select colors"
  name="fieldName"
  options={[{ value: 'color', label: 'Color', colorCode: '#HEX' }]}
  values={data.fieldName || []}     // Array
  onChange={onChange}
  columns={5}                       // Grid columns
/>
```

---

## ✅ Validation Rules Summary

| Page | Field | Rule |
|------|-------|------|
| 0 | All fields | Required (4 fields) |
| 1 | socialMediaPlatforms | ≥ 1 selection |
| 1 | techUpdateSources | ≥ 1 selection |
| 1 | Single selects | Required |
| 2 | topPhoneFunctions | **Exactly 3** selections |
| 2 | tecnoExperienceRating | Required **only if** tecnoExperience === 'yes-used' |
| 2 | Other fields | Required |
| 3 | learningSkills | ≥ 1 selection |
| 3 | partTimeWork | ≥ 1 selection |
| 4 | phoneFeaturesRanking | **All 8 features ranked 1-8, no duplicates** |
| 4 | phoneBudget | Required |
| 4 | preferredPhoneColors | ≥ 1 selection |
| 5 | ambassadorStrengths | Required **only if** interestedInAmbassador === 'yes' |
| 5 | ambassadorBenefits | Required **only if** interestedInAmbassador === 'yes' |
| 6 | name | Required |
| 6 | contactNumber | Required |
| 6 | socialMediaPlatform | Required |
| 6 | socialMediaLink | **Optional** |
| 6 | followerCount | Required |
| 7 | suggestions | **Optional** |

**Validation Timing**: On "Next" or "Submit" button click, NOT real-time

---

## 🔄 Store Actions Quick Reference

```javascript
// Import store
import useSurveyStore from '../store/surveyStore';

// In component
const {
  surveyData,              // Current form data
  currentPage,             // Current page index (0-7)
  updateSurveyData,        // Update fields
  nextPage,                // Increment page
  previousPage,            // Decrement page
  setCurrentPage,          // Jump to page
  submitSurvey,            // Submit to backend
  resetSurvey,             // Clear all data
  startFreshSurvey         // Clear and restart
} = useSurveyStore();

// Usage examples
updateSurveyData({ gender: 'male' });
updateSurveyData({ gender: 'male', yearOfStudy: 'third-year' });
nextPage();
await submitSurvey();
resetSurvey();
```

---

## 🧭 Navigation Logic

### Page Flow

```
HomePage (/) 
  → Start button → Clear data, go to /survey/1

Page 1-5: Normal flow
  → Next: Validate → Go to next page
  → Back: Go to previous page

Page 6 (Ambassador):
  → Yes: Show fields → Next → Page 7
  → Skip: Jump to Page 8 (skip Page 7)

Page 7 (Contact): Only if interested in ambassador
  → Next: Go to Page 8

Page 8 (Suggestions):
  → Submit: Send to backend → /thank-you
  → Back:
      If came from Page 7: Back to Page 7
      If skipped Page 6: Back to Page 6

ThankYouPage (/thank-you)
  → "Start New Survey": Reset data, go to /
```

### URL Structure

```
/                    → HomePage
/survey/1            → Basic Information (Page 0 in code)
/survey/2            → Social Media (Page 1 in code)
/survey/3            → Mobile Usage (Page 2 in code)
/survey/4            → Skills & Work (Page 3 in code)
/survey/5            → Phone Preferences (Page 4 in code)
/survey/6            → Ambassador (Page 5 in code)
/survey/7            → Contact Info (Page 6 in code)
/survey/8            → Suggestions (Page 7 in code)
/thank-you           → Thank You Page
```

**Note**: URL page number = currentPage + 1

---

## 🔌 API Format

### Request to Backend

```javascript
POST /.netlify/functions/submit-survey
Content-Type: application/json

{
  "gender": "male",
  "yearOfStudy": "third-year",
  // ... all 50+ fields from surveyData
}
```

### Expected Response

**Success:**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "id": 12345,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Fallback Mechanism

If backend unavailable (404, ECONNREFUSED, ERR_NETWORK):
1. Data saved to `localStorage['survey-submissions']`
2. User still sees success message
3. Response includes `{ success: true, fallback: true }`
4. Can be retried later with `retryFallbackSubmissions()`

---

## 🐛 Debugging Cheat Sheet

### Check Current State

```javascript
// In browser console
localStorage.getItem('survey-storage')          // Raw JSON
JSON.parse(localStorage.getItem('survey-storage'))  // Parsed object

// Get specific field
const storage = JSON.parse(localStorage.getItem('survey-storage'));
console.log(storage.state.surveyData.gender);

// Access store directly
useSurveyStore.getState().surveyData
useSurveyStore.getState().currentPage
```

### Common Issues

**Issue**: Data not saving
```javascript
// Check if localStorage is working
try {
  localStorage.setItem('test', '1');
  console.log('localStorage works');
} catch (e) {
  console.error('localStorage blocked:', e);
}
```

**Issue**: Validation not working
```javascript
// Add to isPageValid() function
console.log('Validating page', currentPage);
console.log('Data:', surveyData);
console.log('Valid:', result);
```

**Issue**: onChange not firing
```javascript
// Add to handleDataChange
const handleDataChange = (fieldName, value) => {
  console.log('Field changed:', fieldName, '=', value);
  updateSurveyData({ [fieldName]: value });
};
```

### Clear All Data

```javascript
// Clear active survey
localStorage.removeItem('survey-storage');

// Clear fallback submissions
localStorage.removeItem('survey-submissions');

// Clear everything
localStorage.clear();

// Reset store (without clearing localStorage)
useSurveyStore.getState().resetSurvey();
```

---

## 🎨 Styling Reference

### CSS Class Naming Pattern

```css
/* Component block */
.component-name { }

/* Element */
.component-name__element { }

/* Modifier */
.component-name__element--modifier { }

/* State */
.component-name.is-active { }
.component-name.is-disabled { }
```

### Responsive Breakpoints

```css
/* Mobile: Default (0-767px) */
.element { }

/* Tablet: 768px+ */
@media (min-width: 768px) { }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { }
```

---

## 📝 Adding a New Field (Quick Steps)

1. **Add to store** (`src/store/surveyStore.js`):
   ```javascript
   surveyData: {
     // ...
     newField: '',  // or [] for array
   }
   
   // Also add to resetSurvey()
   ```

2. **Add to form** (`src/components/forms/[Page]Form.js`):
   ```javascript
   <DropdownWithOther
     label="New Field"
     name="newField"
     options={options}
     value={data.newField}
     onChange={onChange}
     required={true}
   />
   ```

3. **Add validation** (`src/pages/SurveyPage.js`):
   ```javascript
   case X: {
     const { existingFields, newField } = surveyData;
     return !!(existingFields && ... && newField);
   }
   ```

4. **Test**:
   - Fill field → Check localStorage
   - Navigate away and back → Data persists?
   - Submit → Field included in payload?

---

## 🚀 Deployment Quick Guide

### Build & Deploy

```bash
# 1. Test locally
npm test
npm start

# 2. Build
npm run build

# 3. Test production build
npx serve -s build

# 4. Deploy to Netlify
# (Push to GitHub → Auto-deploys)
```

### Netlify Settings

```
Build command: npm run build
Publish directory: build
Environment variables: (none required currently)
Redirects: Configured in public/_redirects
```

---

## 📚 File Location Quick Finder

Need to edit...?

**Survey data structure** → `src/store/surveyStore.js`  
**Validation logic** → `src/pages/SurveyPage.js` → `isPageValid()`  
**Page navigation** → `src/pages/SurveyPage.js` → `handleNext()`, `handlePrevious()`  
**Form for page X** → `src/components/forms/[PageName]Form.js`  
**Reusable input component** → `src/components/FormComponents.js`  
**Routing** → `src/App.js`  
**Submission logic** → `src/store/surveyStore.js` → `submitSurvey()`  
**Home page** → `src/pages/HomePage.js`  
**Thank you page** → `src/pages/ThankYouPage.js`  
**Global styles** → `src/index.css`  
**App-level styles** → `src/App.css`  
**Component styles** → Co-located: `ComponentName.css`

---

## 🔍 Search Patterns

Use these to find code quickly:

```bash
# Find where a field is used
grep -r "fieldName" src/

# Find validation logic
grep -r "isPageValid" src/

# Find form components
ls src/components/forms/

# Find all uses of store
grep -r "useSurveyStore" src/

# Find navigation logic
grep -r "navigate" src/

# Find API calls
grep -r "axios" src/
grep -r "submit-survey" src/
```

---

## 💡 Pro Tips

### Performance
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers in heavy forms
- Consider code splitting for large forms

### Debugging
- Add `console.log` in `handleDataChange` to trace all changes
- Use React DevTools to inspect component state
- Check Network tab for API calls

### Development
- Keep dev server running: auto-reloads on changes
- Use browser DevTools console for quick localStorage checks
- Test on mobile viewport in browser DevTools

### Testing
- Test full flow: Start → Fill all → Submit → Thank you
- Test validation: Try proceeding with empty fields
- Test persistence: Refresh mid-survey
- Test skip logic: Skip ambassador page
- Test back button: Go back and forth

---

## 📞 Quick Contact Points

**Project Type**: Survey Application  
**Primary Tech**: React + Zustand  
**Hosting**: Netlify  
**Backend**: Netlify Functions (to be implemented)  
**Database**: PostgreSQL (to be implemented)  

**Key Dependencies**:
- `react@19.2.0`
- `react-router-dom@7.9.4`
- `zustand@5.0.8`
- `axios@1.12.2`

---

## 📖 Documentation Files

For more detailed information, see:

1. **DOCUMENTATION.md** - Complete technical documentation
2. **DATA_FLOW_DIAGRAMS.md** - Visual data flow diagrams
3. **DEVELOPER_GUIDE.md** - Development guide and best practices
4. **QUICK_REFERENCE.md** - This file (quick lookup)

---

**Quick Reference Version: 1.0**  
*Last Updated: [Current Date]*



