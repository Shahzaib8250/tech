# TECNO TRIBE Survey Application

<div align="center">
  <img src="public/Favicon-T-Png.png" alt="TECNO Logo" width="120"/>
  
  ### Catch the Vibe, Lead the Tribe
  
  A comprehensive multi-page survey system for TECNO mobile phone campus activities and brand ambassador recruitment.
  
  [![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
  [![Zustand](https://img.shields.io/badge/Zustand-5.0.8-purple.svg)](https://github.com/pmndrs/zustand)
  [![React Router](https://img.shields.io/badge/React%20Router-7.9.4-red.svg)](https://reactrouter.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📖 About The Project

TECNO TRIBE Survey is a modern, user-friendly web application designed to collect comprehensive feedback from students about their mobile phone usage, technology preferences, and interest in becoming TECNO brand ambassadors. The application features:

- **8-Page Multi-Step Survey** - Progressive data collection with validation
- **Smart Data Persistence** - Auto-save to localStorage, no data loss on refresh
- **Conditional Logic** - Dynamic form fields based on user responses
- **Responsive Design** - Seamless experience across all devices
- **Fallback Mechanism** - Resilient offline data storage
- **Brand Ambassador Recruitment** - Integrated lead generation for campus ambassadors

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm 6+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd technotribe

# Install dependencies
npm install

# Start development server
npm start

# Open your browser to http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npx serve -s build
```

---

## 📚 Documentation

This project includes comprehensive documentation to help you understand and work with the codebase:

### 📘 [DOCUMENTATION.md](./DOCUMENTATION.md)
**Complete Technical Documentation**
- Project architecture and design patterns
- Technology stack details
- Component hierarchy and structure
- State management with Zustand
- Validation logic and rules
- API integration specifications
- Deployment guide
- Future enhancements

### 📊 [DATA_FLOW_DIAGRAMS.md](./DATA_FLOW_DIAGRAMS.md)
**Visual Data Flow Documentation**
- Complete user journey flow
- State management lifecycle
- API submission flow with fallback
- Validation flow diagrams
- localStorage structure
- Component communication flow
- Error handling scenarios

### 🛠️ [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
**Development Guide & Best Practices**
- Step-by-step component creation
- Code style guidelines
- Testing strategies (Unit, Integration, E2E)
- API endpoint specifications
- Database schema
- Debugging tips and tricks
- Performance optimization
- Security best practices

### ⚡ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Quick Reference Guide**
- Essential commands
- Data structure cheat sheet
- Form components usage
- Validation rules summary
- Store actions reference
- Debugging cheat sheet
- Pro tips and tricks

---

## 🏗️ Project Structure

```
technotribe/
├── public/                  # Static assets
│   ├── index.html          # HTML template
│   ├── _redirects          # Netlify routing rules
│   └── [images]            # Background images, favicons
│
├── src/
│   ├── components/         # Reusable components
│   │   ├── forms/          # 8 survey form components
│   │   ├── FormComponents.js  # Core form inputs library
│   │   └── ColorPicker.js     # Color selection component
│   │
│   ├── pages/              # Page components
│   │   ├── HomePage.js     # Landing page
│   │   ├── SurveyPage.js   # Main survey container
│   │   └── ThankYouPage.js # Completion page
│   │
│   ├── store/              # State management
│   │   └── surveyStore.js  # Zustand store with persistence
│   │
│   ├── assets/             # Images, icons, logos
│   │   └── index.js        # Asset exports
│   │
│   ├── App.js              # Root component with routing
│   └── index.js            # React entry point
│
├── DOCUMENTATION.md        # Complete technical docs
├── DATA_FLOW_DIAGRAMS.md   # Visual flow diagrams
├── DEVELOPER_GUIDE.md      # Development guide
├── QUICK_REFERENCE.md      # Quick lookup guide
└── package.json            # Dependencies
```

---

## 🎯 Key Features

### 📝 Survey Flow
1. **Basic Information** - Demographics and academic details
2. **Social Media Habits** - Platform usage and tech content consumption
3. **Mobile Phone Usage** - Current phone brand and usage patterns
4. **Skills & Work** - Learning activities and part-time work
5. **Phone Preferences** - Feature ranking and budget preferences
6. **Ambassador Program** - Interest and strengths (optional)
7. **Contact Information** - Details for ambassador candidates
8. **Suggestions** - Open feedback (optional)

### ✨ Technical Highlights

- **Progressive Enhancement** - Works even if JavaScript is slow to load
- **Offline Support** - Fallback storage when backend is unavailable
- **Smart Validation** - Validates only on submission, not while typing
- **Conditional Navigation** - Skip logic for optional sections
- **Data Persistence** - Auto-saves progress to localStorage
- **Responsive Images** - Adaptive backgrounds for mobile/desktop

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - UI library with latest features
- **React Router DOM 7.9.4** - Client-side routing
- **Zustand 5.0.8** - Lightweight state management
- **Axios 1.12.2** - HTTP client for API requests
- **CSS3** - Custom responsive styling

### Backend (Integration Ready)
- **Netlify Functions** - Serverless API endpoints
- **PostgreSQL** - Database for survey responses

### Development Tools
- **Create React App** - Build tooling and configuration
- **React Testing Library** - Component testing
- **ESLint** - Code linting

---

## 📊 Data Flow Overview

```
User Input → Form Component → handleDataChange → 
updateSurveyData (Zustand) → localStorage (persist) → 
Validation → Navigation → Submit → Backend API → 
Clear Data → Thank You Page
```

**Fallback on Network Error:**
```
Submit Error → Save to localStorage('survey-submissions') → 
Show Success → Can Retry Later
```

See [DATA_FLOW_DIAGRAMS.md](./DATA_FLOW_DIAGRAMS.md) for detailed visual diagrams.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for comprehensive testing strategies.

---

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
3. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
# Deploy the 'build' folder to your hosting provider
```

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed deployment instructions.

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
REACT_APP_API_URL=/.netlify/functions
REACT_APP_ANALYTICS_ID=your-analytics-id
```

### Browser Support

- **Production:** >0.2%, not dead, not op_mini all
- **Development:** Latest Chrome, Firefox, Safari

---

## 📖 Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

If you need full control over the build configuration, you can eject at any time.

---

## 🐛 Troubleshooting

### Common Issues

**Data not persisting?**
- Check if localStorage is enabled in your browser
- Verify you're not in private/incognito mode

**Validation not working?**
- Check browser console for errors
- Verify field names match between form and validation

**Submit button not responding?**
- Check network tab for API errors
- Verify backend endpoint is accessible

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for debugging cheat sheet.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development guidelines and best practices.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- State management by [Zustand](https://github.com/pmndrs/zustand)
- Routing by [React Router](https://reactrouter.com/)
- Icons and assets from TECNO brand guidelines

---

## 📞 Support

For issues, questions, or contributions:

- **Documentation:** See the docs folder for comprehensive guides
- **Issues:** Open an issue on GitHub
- **Questions:** Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) first

---

## 🗺️ Roadmap

- [ ] Backend API implementation (Netlify Functions + PostgreSQL)
- [ ] Admin dashboard for viewing responses
- [ ] Real-time analytics and reporting
- [ ] Multi-language support (English/Urdu)
- [ ] Progressive Web App (PWA) features
- [ ] Email notifications for ambassador candidates
- [ ] Advanced data visualization
- [ ] Export functionality (CSV/Excel)

See [DOCUMENTATION.md](./DOCUMENTATION.md) → Future Enhancements for detailed roadmap.

---

<div align="center">
  <p><strong>Made with ❤️ for TECNO Campus Activities</strong></p>
  <p>
    <a href="./DOCUMENTATION.md">📘 Full Documentation</a> •
    <a href="./DATA_FLOW_DIAGRAMS.md">📊 Flow Diagrams</a> •
    <a href="./DEVELOPER_GUIDE.md">🛠️ Dev Guide</a> •
    <a href="./QUICK_REFERENCE.md">⚡ Quick Reference</a>
  </p>
</div>
