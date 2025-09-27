import React, { useState } from 'react';
import '../styles/Questionnaire.css';

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState('quiz'); // 'quiz', 'result'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState({ style: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

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

  const learningStyleDescriptions = {
    "Visual": "You learn best through visual aids such as diagrams, charts, videos, and spatial understanding. Visual learners often prefer to see information presented graphically and may think in pictures. To optimize your learning, use color-coding, mind maps, and visual cues when studying.",
    "Auditory": "You learn best through listening and verbal communication. Auditory learners benefit from discussions, lectures, and talking through concepts. To enhance your learning, consider reading aloud, participating in group discussions, and using voice recordings for review.",
    "Reading/Writing": "You learn best through written words and text-based input. Reading/writing learners excel when information is displayed as text and benefit from making lists, reading textbooks, and taking detailed notes. To maximize your learning, focus on text-based resources and writing summaries of information.",
    "Kinesthetic": "You learn best through physical activities and hands-on experiences. Kinesthetic learners need to touch, move, and do in order to understand concepts fully. To improve your learning, incorporate movement into study sessions, use hands-on experiments, and take frequent breaks for physical activity."
  };



  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert('Please select an answer before continuing.');
      return;
    }
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1] || '');
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1] || '');
    }
  };

  const handleSubmit = (answers) => {
    setIsLoading(true);
    setCurrentStep('result');
    
    // Simulate API call
    setTimeout(() => {
      const learningStyle = calculateLearningStyle(answers);
      setResult({
        style: learningStyle,
        description: learningStyleDescriptions[learningStyle]
      });
      setIsLoading(false);
    }, 1500);
  };

  const calculateLearningStyle = (answers) => {
    const scores = { "0": 0, "1": 0, "2": 0, "3": 0 }; // Visual, Auditory, Reading/Writing, Kinesthetic
    
    answers.forEach(answer => {
      scores[answer]++;
    });
    
    const styleMap = { "0": "Visual", "1": "Auditory", "2": "Reading/Writing", "3": "Kinesthetic" };
    let maxScore = 0;
    let dominantStyle = "0";
    
    for (const [style, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        dominantStyle = style;
      }
    }
    
    return styleMap[dominantStyle];
  };

  const handleRestart = () => {
    setCurrentStep('quiz');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setResult({ style: '', description: '' });
    setIsLoading(false);
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  return (
    <div className="questionnaire-container">
      <h1 className="main-title gradient-text">Find Your Learning Style</h1>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: currentStep === 'quiz' ? `${getProgress()}%` : '100%' }}
          ></div>
        </div>
      </div>

      {/* Quiz Step */}
      {currentStep === 'quiz' && (
        <div className="form-container quiz-card animate-fade-in">
          <div className="ray"></div>
          <div className="line topl"></div>
          <div className="line bottoml"></div>
          <div className="line leftl"></div>
          <div className="line rightl"></div>
          
          <div className="question-number">{currentQuestion + 1}</div>
          <div className="question-text">{questions[currentQuestion]}</div>
          
          <div className="options-container">
            {options[currentQuestion].map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswer === index.toString() ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </button>
            ))}
          </div>
          
          <div className="button-group">
            <button 
              className="prev-btn" 
              onClick={handlePrevious}
              style={{ visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}
            >
              Previous
            </button>
            <button 
              className={currentQuestion === questions.length - 1 ? 'submit-btn' : 'next-btn'}
              onClick={handleNext}
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Result Step */}
      {currentStep === 'result' && (
        <div className="form-container result-card animate-fade-in">
          <div className="ray"></div>
          <div className="line topl"></div>
          <div className="line bottoml"></div>
          <div className="line leftl"></div>
          <div className="line rightl"></div>
          
          <div className="result-heading">Your Learning Style Result</div>
          <div className="result-style">
            {isLoading ? 'Processing...' : result.style}
          </div>
          {isLoading && <div className="loading"></div>}
          <div className="result-description">
            {isLoading ? 'Please wait while we analyze your learning style...' : result.description}
          </div>
          <button className="restart-btn" onClick={handleRestart}>Take Quiz Again</button>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;