// src/pages/KidsEngagementPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Play, Music, BookOpen, Star } from 'lucide-react';
import '../styles/KidsEngagementPage.css';

// --- Reusable Components (within this file) ---

const ProgressBar = () => (
  <div className="progress-bar-container">
    <div className="progress-step active">
      <div className="step-circle">1</div>
      <span>Exploration</span>
    </div>
    <div className="progress-line"></div>
    <div className="progress-step">
      <div className="step-circle">2</div>
      <span>Questionnaire</span>
    </div>
    <div className="progress-line"></div>
    <div className="progress-step">
      <div className="step-circle">3</div>
      <span>Your Profile</span>
    </div>
  </div>
);

const DiscoveryCard = ({ id, icon, title, content, onComplete, isCompleted }) => {
  const handleInteraction = () => {
    // Prevent re-triggering the completion
    if (!isCompleted) {
      onComplete(id);
    }
  };

  return (
    <div className={`discovery-card ${isCompleted ? 'completed' : ''}`}>
      {isCompleted && (
        <div className="completed-overlay">
          <CheckCircle size={60} color="#fff" />
        </div>
      )}
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {content(handleInteraction)}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const KidsEngagementPage = () => {
  const navigate = useNavigate();
  // We use a Set to efficiently store the unique IDs of completed cards
  const [completedCards, setCompletedCards] = useState(new Set());

  const handleCardComplete = (cardId) => {
    setCompletedCards(prev => new Set(prev).add(cardId));
  };

  const cards = [
    {
      id: 'visual',
      icon: '🎨',
      title: 'Story Time!',
      content: (onInteract) => (
        <>
          <p>Watch a short, fun story about a friendly dragon!</p>
          <button className="card-button visual" onClick={onInteract}>
            <Play size={16} /> Play Story
          </button>
        </>
      )
    },
    {
      id: 'auditory',
      icon: '🎧',
      title: 'Listen & Guess',
      content: (onInteract) => (
        <>
          <p>Can you guess the animal by its sound?</p>
          <button className="card-button auditory" onClick={onInteract}>
            <Music size={16} /> Listen
          </button>
        </>
      )
    },
    {
      id: 'read-write',
      icon: '📖',
      title: 'Read Along',
      content: (onInteract) => (
        <>
          <p className="read-along-text">The happy sun shines bright.</p>
          <button className="card-button read-write" onClick={onInteract}>
            <BookOpen size={16} /> I Read It!
          </button>
        </>
      )
    },
    {
      id: 'kinesthetic',
      icon: '🧩',
      title: 'Shape Sorter',
      content: (onInteract) => (
        <>
          <p>Drag the star into the matching shape outline.</p>
          <button className="card-button kinesthetic" onClick={onInteract}>
            <Star size={16} /> Play Game
          </button>
        </>
      )
    }
  ];

  return (
    <div className="discovery-container">
      <ProgressBar />
      
      <header className="discovery-header">
        <h1>Let's Discover How You Learn Best</h1>
        <p>Briefly explore the fun activities below. Your choices will help us build your perfect learning plan!</p>
      </header>

      <main className="card-grid">
        {cards.map(card => (
          <DiscoveryCard 
            key={card.id}
            id={card.id}
            icon={card.icon}
            title={card.title}
            content={card.content}
            onComplete={handleCardComplete}
            isCompleted={completedCards.has(card.id)}
          />
        ))}
      </main>

      <footer className="discovery-footer">
        <button 
          className="continue-button"
          disabled={completedCards.size < 2}
          onClick={() => navigate('/questionnaire')} // Navigate to the next page
        >
          Continue to Questionnaire →
        </button>
      </footer>
    </div>
  );
};

export default KidsEngagementPage;