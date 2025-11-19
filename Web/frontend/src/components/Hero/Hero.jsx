import React from 'react';
import './Hero.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      {/* Overlay content */}
      <div className="hero-content">
        <h1 className="hero-title">Experience the Fast and Easy Way to Travel in Rwanda</h1>
        <p className="hero-subtitle">We ease your transportation</p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Book Fleet</button>
          <button className="btn btn-secondary">Check Our Flight</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
