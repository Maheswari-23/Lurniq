import React from 'react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const navigate = useNavigate();
  const learningStyle = 'Visual'; // This would be calculated dynamically

  return (
    <div className="results-container">
      <h2>Your Assessment Results</h2>
      <p>Based on your answers, your primary learning style is:</p>
      
      <div className="result-highlight">
        <h1>🎨 {learningStyle}</h1>
      </div>

      <div className="card recommendations-section">
        <h3>Personalized Study Tips</h3>
        <ul>
          <li>Use mind maps and flowcharts to organize information.</li>
          <li>Incorporate color-coding and highlighters in your notes.</li>
          <li>Watch videos and documentaries related to your topics.</li>
          <li>Visualize concepts and processes in your mind.</li>
        </ul>
      </div>

      <button className="btn" style={{maxWidth: '300px', marginTop: '1rem'}} onClick={() => navigate('/assessment')}>
        Retake Questionnaire
      </button>
    </div>
  );
};

export default Results;