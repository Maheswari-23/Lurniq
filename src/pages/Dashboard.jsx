import React from 'react';

const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

const ProgressCircle = ({ percentage }) => (
  <div className="progress-circle" style={{ '--p': percentage }}>
    {percentage}%
  </div>
);

const Dashboard = () => {
  const studentName = 'Alex'; // Replace with dynamic data

  return (
    <div>
      <header className="dashboard-header">
        <h1>Welcome back, {studentName}! 👋</h1>
        <p>Here's your personalized learning dashboard.</p>
      </header>
      
      {/* --- Engagement Metrics --- */}
      <section>
        <h2>Your Progress</h2>
        <div className="metrics-section">
          <Card className="metric-card">
            <h3>Overall Progress</h3>
            <ProgressCircle percentage={75} />
          </Card>
          <Card className="metric-card">
            <h3>Engagement Score</h3>
            <ProgressCircle percentage={92} />
          </Card>
          <Card className="metric-card">
            <h3>Activity Streak</h3>
            <div style={{fontSize: '2.5rem', fontWeight: 600, marginTop: '1rem'}}>
              12 Days 🔥
            </div>
          </Card>
        </div>
      </section>
      
      {/* --- VARK-based Content --- */}
      <section>
        <h2>Recommended For You</h2>
        <div className="content-grid">
          <Card className="content-card">
            <h3>🎨 Visual Learning Module</h3>
            <p>Interactive infographics on the solar system. Watch and learn!</p>
          </Card>
          <Card className="content-card">
            <h3>🎧 Auditory Content</h3>
            <p>Podcast series on historical events. Listen on the go.</p>
          </Card>
          <Card className="content-card">
            <h3>✍️ Reading/Writing Task</h3>
            <p>Summarize the provided text on cellular biology.</p>
          </Card>
          <Card className="content-card">
            <h3>🏃‍♂️ Kinesthetic Activity</h3>
            <p>Build a model of a DNA helix with our hands-on guide.</p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;