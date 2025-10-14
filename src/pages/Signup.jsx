// src/pages/Signup.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    // On success, navigate to the profile setup page
    navigate('/profile-setup');
  };

  const styles = {
    formContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFFFFF',
      padding: '20px',
    },
    formCardWrapper: {
      background: 'linear-gradient(90deg, #F97AFE 0%, #7B61FF 100%)',
      borderRadius: '16px',
      padding: '3px',
      maxWidth: '450px',
      width: '100%',
    },
    formCard: {
      background: 'white',
      borderRadius: '14px',
      padding: '40px',
      width: '100%',
      textAlign: 'center',
    },
    formLogo: {
      width: '80px',
      height: '80px',
      marginBottom: '20px',
      objectFit: 'contain',
    },
    heading: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '30px',
    },
    form: {
      textAlign: 'left',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '14px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '14px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    formButton: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      background: 'linear-gradient(90deg, #F97AFE 0%, #7B61FF 100%)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      marginTop: '10px',
    },
    formLink: {
      marginTop: '25px',
      fontSize: '14px',
      color: '#6B7280',
    },
    link: {
      color: '#7B61FF',
      fontWeight: '600',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formCardWrapper}>
        <div style={styles.formCard}>
          <img src={Logo} alt="Lurniq Logo" style={styles.formLogo} />
          <h1 style={styles.heading}>Create Your Account</h1>
          <p style={styles.subtitle}>Start your personalized learning journey today.</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your full name" 
                required 
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7B61FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(123, 97, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="age-group" style={styles.label}>Age Group</label>
              <select 
                id="age-group" 
                required
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7B61FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(123, 97, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Select your age group</option>
                <option value="5-10">5-10 Years</option>
                <option value="11-15">11-15 Years</option>
                <option value="16-20">16-20 Years</option>
                <option value="21-25">21-25 Years</option>
                <option value="25+">25+ Years</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                required 
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7B61FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(123, 97, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Create a password" 
                required 
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7B61FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(123, 97, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button 
              type="submit" 
              style={styles.formButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px -5px rgba(123, 97, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Sign Up
            </button>
          </form>

          <p style={styles.formLink}>
            Already have an account?{' '}
            <Link to="/signin" style={styles.link}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;