// src/pages/Signin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Signin = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    // On success, navigate to dashboard or another appropriate page
    console.log('User signed in');
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <img src={Logo} alt="Lurniq Logo" className="form-logo" />
        <h1>Welcome Back!</h1>
        <p>Sign in to continue your learning journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="form-button">Sign In</button>
        </form>

        <p className="form-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;