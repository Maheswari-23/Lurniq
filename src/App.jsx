// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ProfileSetup from './pages/ProfileSetup';
import VARKContentPage from './pages/VARKContent';
import Questionnaire from './pages/Questionnaire';  // ✅ import

import Navbar from './components/Navbar';

function App() {
  const MainLayout = ({ children }) => (
    <>
      <Navbar />
      <main className="app-container">{children}</main>
    </>
  );

  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        {/* Protected/learning pages */}
        <Route
          path="/vark"
          element={
            <MainLayout>
              <VARKContentPage />
            </MainLayout>
          }
          
        />

        {/* Optional: Catch-all 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
