import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import ThankYouPage from './pages/ThankYouPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/survey/:page" element={<SurveyPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
