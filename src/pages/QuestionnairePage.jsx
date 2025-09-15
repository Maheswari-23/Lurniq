// src/pages/QuestionnairePage.jsx

import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuestionnairePage.css'; // We'll create this CSS file next

// --- The Quiz Data (from your prompt) ---
const questions = [
  "When studying for an exam, what method do you find most effective?",
  "When you need to remember a phone number or address, how do you do it?",
  "If you were to learn how to assemble a piece of furniture, what would you do?",
  "In a classroom setting, what type of teaching style helps you learn best?",
  "How do you prefer to express your ideas and thoughts?",
  "When learning a new language, what method works best for you?",
  "How do you prefer to organize your work or study materials?",
  "What kind of environment helps you focus the best when working or studying?",
  "When you need to remember a key point or quote from a book, how do you do it?",
  "How do you prefer to solve a problem?"
];

const options = [
  ["Drawing diagrams or watching videos", "Listening to recordings or discussing the material", "Writing summaries or reading notes", "Using hands-on practice or engaging in physical activities"],
  ["I visualize the number", "I say it out loud", "I write it down or read it multiple times", "I repeat it while moving"],
  ["Look at the diagrams and pictures in the instruction manual", "Watch a video or listen to someone explain the process", "Read the step-by-step instructions", "Start putting it together right away and figure it out as you go"],
  ["Teachers who use visual aids like slides, charts, or videos", "Teachers who lecture and explain things out loud", "Teachers who provide detailed written notes and reading materials", "Teachers who include activities, experiments, or hands-on learning"],
  ["Through drawings, diagrams, or visual presentations", "Through speaking or discussions", "Through writing essays, reports, or detailed notes", "Through actions, demonstrations, or role-playing"],
  ["Using flashcards with pictures or watching videos", "Listening to the language through conversations or audio lessons", "Reading textbooks, articles, or writing out vocabulary", "Practicing speaking with gestures or engaging in interactive activities"],
  ["By color-coding, using visual organizers, or keeping visual reminders", "By discussing the organization with someone or explaining it out loud", "By making lists, writing out schedules, or taking detailed notes", "By arranging items physically or creating hands-on displays"],
  ["A space with visual inspiration, like posters or visual organizers", "A space where you can listen to music or discussions without distractions", "A quiet space where you can read or write without interruptions", "A space where you can move around, stand, or engage in physical activities"],
  ["I visualize the page in my mind or remember the picture associated with the point", "I repeat the quote out loud or discuss it with someone else", "I write it down in my notes or underline it in the book", "I remember the context by associating the quote with an action or physical movement I made while reading"],
  ["By visualizing the problem and solution in your head", "By talking through the problem with others or hearing different perspectives", "By writing out the problem and working through it step by step", "By trying different solutions through trial and error"]
];

// Combine the data into a more usable format
const quizData = questions.map((question, index) => ({
  question,
  options: options[index].map(option => option.replace(/ \(\d\)/, '')) // Removes the "(1)", "(2)", etc.
}));


const QuestionnairePage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleAnswerClick = (optionIndex) => {
    // Prevent clicking while animating
    if (isAnimating) return;

    // Record the answer
    setAnswers([...answers, optionIndex]);
    setIsAnimating(true);

    // After a short delay for the animation, move to the next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Navigate to the results/analysis page after the last question
        navigate('/results'); 
      }
      setIsAnimating(false);
    }, 500); // This delay should match the animation duration in CSS
  };

  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  return (
    <div className="questionnaire-container">
      <div className="quiz-wrapper">
        <div className="progress-bar-wrapper">
          <div className="progress-info">
            <span>Question {currentQuestionIndex + 1} of {quizData.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className={`quiz-card ${isAnimating ? 'animating-out' : 'animating-in'}`}>
          <h1 className="question-text">{quizData[currentQuestionIndex].question}</h1>
          <div className="options-grid">
            {quizData[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => handleAnswerClick(index)}
              >
                <div className="option-number">{index + 1}</div>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;