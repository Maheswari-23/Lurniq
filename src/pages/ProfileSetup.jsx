// src/pages/ProfileSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileSetup.css'; // We need a separate CSS file for this page

const ProgressIndicator = ({ currentStep }) => (
  <div className="progress-indicator">
    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
      <div className="step-number">1</div>
      <div className="step-label">Personal Info</div>
    </div>
    <div className="progress-line"></div>
    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
      <div className="step-number">2</div>
      <div className="step-label">Education</div>
    </div>
    <div className="progress-line"></div>
    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
      <div className="step-number">3</div>
      <div className="step-label">Preferences</div>
    </div>
  </div>
);

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const finishSetup = () => {
    // Logic to save all profile data
    navigate('/dashboard'); // Or any other final destination
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h1>Complete Your Profile</h1>
        <p>This information helps us personalize your learning experience.</p>
        <ProgressIndicator currentStep={step} />

        <div className="form-content">
          {step === 1 && (
            <form>
              <h2>👤 Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="e.g., Jane" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="e.g., Doe" />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </form>
          )}

          {step === 2 && (
            <form>
              <h2>🎓 Education & Institution</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Education Level</label>
                  <select><option>School</option><option>College</option></select>
                </div>
                <div className="form-group">
                  <label>Institution / University Name</label>
                  <input type="text" placeholder="e.g., State University" />
                </div>
                <div className="form-group">
                  <label>Major / Stream</label>
                  <input type="text" placeholder="e.g., Computer Science" />
                </div>
                 <div className="form-group">
                  <label>Graduation Year</label>
                  <input type="number" placeholder="e.g., 2026" />
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
             <form>
              <h2>📚 Learning Preferences</h2>
               <div className="form-group">
                  <label>Preferred Subjects or Areas of Interest</label>
                  <input type="text" placeholder="e.g., Math, Science, Web Development" />
                </div>
                <div className="form-group">
                  <label>Learning Goals</label>
                  <select>
                    <option>Career Preparation</option>
                    <option>Exam Preparation</option>
                    <option>Upskilling</option>
                    <option>Hobby Learning</option>
                  </select>
                </div>
            </form>
          )}

          <div className="form-navigation">
            {step > 1 && <button onClick={prevStep} className="nav-button prev">Back</button>}
            {step < 3 && <button onClick={nextStep} className="nav-button next">Next</button>}
            {step === 3 && <button onClick={finishSetup} className="nav-button next">Finish Setup</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;