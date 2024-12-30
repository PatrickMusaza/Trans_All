import React from "react";
import "./Book.css";
import { useNavigate } from "react-router-dom";

export const BookPage = () => {
    const navigate = useNavigate();
  
    const handleNavigate = () => {
      navigate("/users");
    };
  
    return (
      <div className="book-page">
        <h1>Book a Service</h1>
        <p>
          Welcome to our booking page! Choose from a range of premium services
          designed to cater to your specific needs. Whether it's logistics,
          transport, or fleet management, we're here to assist you.
        </p>
        <div className="book-options">
          <div className="book-option">
            <h2>Personalized Transport</h2>
            <p>
              Enjoy reliable and efficient transport tailored for your
              requirements. Experience seamless connectivity with our modern
              fleet.
            </p>
            <button onClick={handleNavigate} className="book-button">
              Learn More
            </button>
          </div>
          <div className="book-option">
            <h2>Custom Logistics</h2>
            <p>
              From warehousing to inventory management, we offer end-to-end
              logistic solutions to optimize your business operations.
            </p>
            <button onClick={handleNavigate} className="book-button">
              Learn More
            </button>
          </div>
          <div className="book-option">
            <h2>Route Optimization</h2>
            <p>
              Save time and costs with our intelligent route planning. Let us
              streamline your journey.
            </p>
            <button onClick={handleNavigate} className="book-button">
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  };
  