// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import ALL your pages
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Signin from './pages/Signin'; // Make sure you've created this page
import ProfileSetup from './pages/ProfileSetup'; // Make sure you've created this page
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import KidsEngagementPage from './pages/KidsEngagementPage';
import QuestionnairePage from './pages/QuestionnairePage';
 // Good practice to have a 404 page

// Import the Navbar for the main application layout
import Navbar from './components/Navbar'; 

function App() {
  // This layout is for pages a user sees AFTER they log in.
  const MainLayout = ({ children }) => (
    <>
      <Navbar />
      <main className="app-container">{children}</main>
    </>
  );

  return (
    <Router>
      <Routes>
        {/* --- Public-Facing Pages (No Navbar from MainLayout) --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/discover" element={<KidsEngagementPage />} /> 
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        
        {/* --- Internal App Pages (Wrapped in MainLayout with Navbar) --- */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/assessment" element={<MainLayout><Questionnaire /></MainLayout>} />
        <Route path="/results" element={<MainLayout><Results /></MainLayout>} />

        {/* --- Catch-all 404 Not Found Page --- */}
       
      </Routes>
    </Router>
  );
}

export default App;