import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="app-container">
      <nav className="navbar">
        <div className="logo">VARKLearn</div>
        <div className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/assessment">Assessment</NavLink>
          <NavLink to="/results">Results</NavLink>
          <NavLink to="/signup">Profile</NavLink> {/* Placeholder link */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;