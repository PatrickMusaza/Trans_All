import React from 'react';
import './Hero.css';
import heroImage from '../../../assets/images/1.jpg'; 

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <h1>About Us</h1>
        <p>Discover the team driving innovation at TransConnect.</p>
      </div>
      <img src={heroImage} alt="Hero" className="hero-image" />
    </section>
  );
};

export default HeroSection;
