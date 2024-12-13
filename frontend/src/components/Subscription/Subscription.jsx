import React from 'react';
import './Subscription.css';

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated with the latest news, offers, and transportation solutions!</p>
        <form className="subscription-form">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="input-field"
          />
          <button type="submit" className="subscribe-button">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;

