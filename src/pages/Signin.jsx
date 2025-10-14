// src/pages/Signin.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Signin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with actual sign-in logic (Firebase/Auth API etc.)
    console.log('User signed in');

    // ✅ After successful login → navigate to VARK page
    navigate('/vark');
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
          <h1 style={styles.heading}>Welcome Back!</h1>
          <p style={styles.subtitle}>Sign in to continue your learning journey.</p>

          <form onSubmit={handleSubmit} style={styles.form}>
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
                placeholder="Enter your password"
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
              Sign In
            </button>
          </form>

          <p style={styles.formLink}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;