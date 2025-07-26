import React, { useState } from 'react';
import './HeaderBar.css';

const HeaderBar: React.FC = () => {
  const [textValue, setTextValue] = useState('');

  const handleButtonClick = () => {
    console.log('Button clicked! Text value:', textValue);
    // Add your button functionality here
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  };

  return (
    <header className="header-bar">
      <div className="header-container">
        <h1 className="header-title">My Website</h1>
        <div className="header-controls">
          <textarea
            className="header-textarea"
            placeholder="Enter your text here..."
            value={textValue}
            onChange={handleTextChange}
            rows={2}
          />
          <button 
            className="header-button"
            onClick={handleButtonClick}
          >
            Submit
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar; 