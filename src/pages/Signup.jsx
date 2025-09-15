// src/pages/Signup.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png'; // Make sure the path is correct

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    // On success, navigate to the profile setup page
    navigate('/profile-setup');
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <img src={Logo} alt="Lurniq Logo" className="form-logo" />
        <h1>Create Your Account</h1>
        <p>Start your personalized learning journey today.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" required />
          </div>
          <div className="form-group">
            <label htmlFor="age-group">Age Group</label>
            <select id="age-group" required>
              <option value="">Select your age group</option>
              <option value="5-10">5-10 Years</option>
              <option value="11-15">11-15 Years</option>
              <option value="16-20">16-20 Years</option>
              <option value="21-25">21-25 Years</option>
              <option value="25+">25+ Years</option>
            </select>
          </div>

          <button type="submit" className="form-button">Sign Up</button>
        </form>

        <p className="form-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;