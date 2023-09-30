import React from 'react';
import './App.css';

function SkillBar({ skillName, percentage }) {
  return (
    <div className="skill-bar">
      <div className="skill-name">{skillName}</div>
      <div className="bar-container">
        <div className="bar" style={{ width: `${percentage}%` }}>{percentage}%</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className='App'>
      <h1>My Skills</h1>

      <SkillBar skillName="HTML" percentage={90} />
      <SkillBar skillName="CSS" percentage={80} />
      <SkillBar skillName="JavaScript" percentage={65} />
      <SkillBar skillName="PHP" percentage={60} />
      <SkillBar skillName="Python" percentage={75} />
      <SkillBar skillName="Java" percentage={70} />
    </div>
  );
}

export default App;

