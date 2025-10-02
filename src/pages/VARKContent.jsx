import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useNavigate } from 'react-router-dom';
import '../styles/VARKContent.css';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// --- Helper Components for Drag-and-Drop ---
function DraggableLabel({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-label"
    >
      {children}
    </div>
  );
}

function DroppableArea({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="droppable-area">
      {children}
    </div>
  );
}

// --- Main VARK Content Component ---
const VARKContent = () => {
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState(Date.now());
  const [engagement, setEngagement] = useState({
    visual: { clicks: 0, timeSpent: 0 },
    auditory: { clicks: 0, timeSpent: 0 },
    reading: { clicks: 0, timeSpent: 0 },
    kinesthetic: { clicks: 0, timeSpent: 0 },
  });
  const [activeType, setActiveType] = useState(null);

  // Kinesthetic activity
  const [droppedItems, setDroppedItems] = useState({
    "step-1": null,
    "step-2": null,
    "step-3": null,
  });

  const labels = ["Evaporation", "Condensation", "Precipitation"];
  const droppedLabels = Object.values(droppedItems).filter(Boolean);
  const availableLabels = labels.filter(
    (label) => !droppedLabels.includes(label)
  );

  // Load engagement data from memory on mount
  useEffect(() => {
    const savedEngagement = window.varkEngagement;
    if (savedEngagement) {
      setEngagement(savedEngagement);
      console.log('Loaded engagement data:', savedEngagement);
    }
  }, []);

  // Save engagement to memory whenever it changes
  useEffect(() => {
    window.varkEngagement = engagement;
  }, [engagement]);

  // Navigation to questionnaire with engagement data
  const handleQuestionnaireClick = (learningStyle, event) => {
    event.stopPropagation();
    
    // Calculate final time for active section
    if (activeType) {
      const now = Date.now();
      const duration = Math.floor((now - startTime) / 1000);
      const finalEngagement = {
        ...engagement,
        [activeType]: {
          ...engagement[activeType],
          timeSpent: engagement[activeType].timeSpent + duration,
        },
      };
      
      // Save to memory before navigation
      window.varkEngagement = finalEngagement;
      console.log(`Navigating to questionnaire from ${learningStyle} learning style`);
      console.log('Final engagement data:', finalEngagement);
    }
    
    navigate('/questionnaire');
  };

  // Tracking clicks and time
  const handleContentClick = (type) => {
    const now = Date.now();
    if (activeType) {
      const duration = Math.floor((now - startTime) / 1000);
      setEngagement((prev) => ({
        ...prev,
        [activeType]: {
          ...prev[activeType],
          timeSpent: prev[activeType].timeSpent + duration,
        },
      }));
    }
    setStartTime(now);
    setActiveType(type);
    setEngagement((prev) => ({
      ...prev,
      [type]: { ...prev[type], clicks: prev[type].clicks + 1 },
    }));
  };

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeType) {
        const now = Date.now();
        const duration = Math.floor((now - startTime) / 1000);
        const finalEngagement = {
          ...engagement,
          [activeType]: {
            ...engagement[activeType],
            timeSpent: engagement[activeType].timeSpent + duration,
          },
        };
        window.varkEngagement = finalEngagement;
        console.log("Final Engagement on unload:", finalEngagement);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeType, startTime, engagement]);

  // Handle drag and drop
  function handleDragEnd(event) {
    const { over, active } = event;
    if (over) {
      const isOccupied = Object.values(droppedItems).includes(active.id);
      if (isOccupied) return;
      setDroppedItems((prev) => ({ ...prev, [over.id]: active.id }));
    }
  }

  return (
    <div className="vark-container">
      <div className="vark-header">
        <h1 className="gradient-text">VARK Learning Styles</h1>
        <p className="subtitle">Discover the Water Cycle through Different Learning Approaches</p>
      </div>

      <div className="vark-grid">
        {/* Visual Section */}
        <div
          className="learning-card visual-card animate-fade-in"
          onClick={() => handleContentClick("visual")}
        >
          <div className="card-header">
            <h2>📊 Visual Learning</h2>
            <span className="learning-badge">Watch & See</span>
          </div>
          <p className="card-description">Learn with diagrams, infographics, and videos.</p>
          
          <div className="media-container">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/LkGvA0WZS5o?si=Fr2ziZ2rft0nX0hG"
              title="Water Cycle Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="video-frame"
            ></iframe>
          </div>
          
          <div className="questionnaire-section">
            <button 
              className="questionnaire-btn visual-btn"
              onClick={(e) => handleQuestionnaireClick('visual', e)}
            >
              📋 Take Learning Assessment
            </button>
          </div>
          
          <div className="card-footer">
            <p>🎥 Interactive visual content helps you understand processes through observation</p>
          </div>
        </div>

        {/* Auditory Section */}
        <div
          className="learning-card auditory-card animate-fade-in"
          onClick={() => handleContentClick("auditory")}
        >
          <div className="card-header">
            <h2>🎵 Auditory Learning</h2>
            <span className="learning-badge">Listen & Learn</span>
          </div>
          <p className="card-description">Learn with podcasts, lectures, and discussions.</p>
          
          <div className="media-container">
            <audio controls className="audio-player">
              <source src="/raindrops.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="audio-content">
            <h3>🌧️ Listen to Nature's Symphony</h3>
            <p>Experience the sounds of rain and learn about precipitation patterns through audio explanations and natural soundscapes.</p>
          </div>
          
          <div className="questionnaire-section">
            <button 
              className="questionnaire-btn auditory-btn"
              onClick={(e) => handleQuestionnaireClick('auditory', e)}
            >
              🎧 Take Learning Assessment
            </button>
          </div>
          
          <div className="card-footer">
            <p>🎧 Audio learning helps you retain information through listening and repetition</p>
          </div>
        </div>

        {/* Reading/Writing Section */}
        <div
          className="learning-card reading-card animate-fade-in"
          onClick={() => handleContentClick("reading")}
        >
          <div className="card-header">
            <h2>📚 Reading/Writing</h2>
            <span className="learning-badge">Read & Write</span>
          </div>
          <p className="card-description">Learn through detailed text, notes, and written explanations.</p>
          
          <div className="reading-content">
            <h3>What Is the Water Cycle?</h3>
            <p>The water cycle is the continuous movement of water on Earth. The sun heats water bodies, turning water into vapor through evaporation.</p>

            <div className="step-section">
              <h4>Step 1: Evaporation</h4>
              <p>Sun heats water, turning it into vapor that rises into the air.</p>
            </div>

            <div className="step-section">
              <h4>Step 2: Condensation</h4>
              <p>Water vapor cools and forms tiny droplets, creating clouds.</p>
            </div>

            <div className="step-section">
              <h4>Step 3: Precipitation</h4>
              <p>Droplets grow heavy and fall as rain, snow, or hail.</p>
            </div>

            <div className="key-words">
              <h4>Key Terms</h4>
              <div className="keyword-grid">
                <div className="keyword-item">
                  <strong>Evaporation:</strong> Water turns into vapor
                </div>
                <div className="keyword-item">
                  <strong>Condensation:</strong> Vapor forms clouds
                </div>
                <div className="keyword-item">
                  <strong>Precipitation:</strong> Water falls as rain
                </div>
              </div>
            </div>

            <p className="conclusion">This cycle keeps our planet's water moving and supports all life.</p>
          </div>
          
          <div className="questionnaire-section">
            <button 
              className="questionnaire-btn reading-btn"
              onClick={(e) => handleQuestionnaireClick('reading', e)}
            >
              📝 Take Learning Assessment
            </button>
          </div>
          
          <div className="card-footer">
            <p>📖 Reading and writing helps you process and retain detailed information</p>
          </div>
        </div>

        {/* Kinesthetic Section */}
        <DndContext onDragEnd={handleDragEnd}>
          <div
            className="learning-card kinesthetic-card animate-fade-in"
            onClick={() => handleContentClick("kinesthetic")}
          >
            <div className="card-header">
              <h2>🤹 Kinesthetic Learning</h2>
              <span className="learning-badge">Touch & Move</span>
            </div>
            <p className="card-description">
              Drag and drop the steps of the water cycle into the correct order!
            </p>

            <div className="kinesthetic-activity">
              <div className="step-slots">
                <DroppableArea id="step-1">
                  {droppedItems["step-1"] ? (
                    <div className="dropped-item">{droppedItems["step-1"]}</div>
                  ) : (
                    <span className="step-placeholder">Step 1</span>
                  )}
                </DroppableArea>

                <DroppableArea id="step-2">
                  {droppedItems["step-2"] ? (
                    <div className="dropped-item">{droppedItems["step-2"]}</div>
                  ) : (
                    <span className="step-placeholder">Step 2</span>
                  )}
                </DroppableArea>

                <DroppableArea id="step-3">
                  {droppedItems["step-3"] ? (
                    <div className="dropped-item">{droppedItems["step-3"]}</div>
                  ) : (
                    <span className="step-placeholder">Step 3</span>
                  )}
                </DroppableArea>
              </div>

              <div className="drag-labels-container">
                {availableLabels.length > 0 ? (
                  availableLabels.map((label) => (
                    <DraggableLabel key={label} id={label}>
                      {label}
                    </DraggableLabel>
                  ))
                ) : (
                  <p className="success-message">🎉 Great Job! 🎉</p>
                )}
              </div>

              {droppedItems["step-1"] &&
                droppedItems["step-2"] &&
                droppedItems["step-3"] && (
                  <div className="feedback-section">
                    {droppedItems["step-1"] === "Evaporation" &&
                    droppedItems["step-2"] === "Condensation" &&
                    droppedItems["step-3"] === "Precipitation" ? (
                      <p className="correct-feedback">
                        ✅ Correct! That's the right order.
                      </p>
                    ) : (
                      <p className="incorrect-feedback">
                        ❌ Not quite. Try again!
                      </p>
                    )}
                  </div>
                )}
            </div>
            
            <div className="questionnaire-section">
              <button 
                className="questionnaire-btn kinesthetic-btn"
                onClick={(e) => handleQuestionnaireClick('kinesthetic', e)}
              >
                🎯 Take Learning Assessment
              </button>
            </div>
            
            <div className="card-footer">
              <p>🎯 Hands-on activities help you learn through movement and interaction</p>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default VARKContent;