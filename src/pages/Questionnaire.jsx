import React from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    text: "When learning something new, I prefer to:",
    options: ["Watch a demonstration", "Listen to an explanation", "Read instructions", "Try it out myself"],
  },
  {
    id: 2,
    text: "I remember things best when I:",
    options: ["See pictures and diagrams", "Hear them spoken", "Write them down", "Physically do them"],
  },
  {
    id: 3,
    text: "When assembling furniture, I first:",
    options: ["Look at the diagrams", "Have someone explain it", "Read the manual carefully", "Jump right in and start building"],
  },
];

const Questionnaire = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process answers and navigate to results
    navigate('/results');
  };

  return (
    <div className="assessment-container">
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Discover Your Learning Style</h2>
        <p>Take this short assessment to get personalized recommendations.</p>
      </header>
      
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="card question-card">
            <p className="question-text">{q.id}. {q.text}</p>
            <div className="options-group">
              {q.options.map((option, index) => (
                <label key={index} className="option">
                  <input type="radio" name={`question-${q.id}`} value={option} required />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="btn">
          Submit Assessment
        </button>
      </form>
    </div>
  );
};

export default Questionnaire;