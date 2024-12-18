import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

const BookingConfirmation = () => {
    const { state } = useLocation(); // Get the route/state passed from the previous page
    const navigate = useNavigate();

    // Simulate order number (can be replaced with actual order number if applicable)
    const orderNumber = Math.floor(Math.random() * 1000000);

    // Simulate tracking info (replace with real tracking info from backend)
    const trackingInfo = `Track your ride: http://tracking-link.com/${orderNumber}`;

    return (
        <div className="booking-confirmation">
            <h1>Booking Successful!</h1>
            <p>Your seat has been successfully booked. Here are your details:</p>

            <div className="confirmation-details">
                <p><strong>Order Number:</strong> {orderNumber}</p>
                <p><strong>From:</strong> {state?.route?.from_place}</p>
                <p><strong>To:</strong> {state?.route?.to_place}</p>
                <p><strong>Driver:</strong> {state?.driver?.first_name} {state?.driver?.last_name}</p>
                <p><strong>Price:</strong> RWF {state?.price}</p>
                <p><strong>Distance:</strong> {state?.route?.distance} km</p>
            </div>

            <div className="tracking-info">
                <p><strong>Track Your Ride:</strong></p>
                <a href={trackingInfo} target="_blank" rel="noopener noreferrer">
                    {trackingInfo}
                </a>
            </div>

            <button onClick={() => navigate("/users")}>Go to My Dashboard</button>
        </div>
    );
};

export default BookingConfirmation;
