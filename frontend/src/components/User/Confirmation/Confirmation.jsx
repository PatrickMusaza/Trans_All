import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [passengers, setPassengers] = useState(state?.passengers || 0);

    const handleConfirmBooking = () => {
        if (passengers > 1) {
            setPassengers(passengers - 1);
            alert("Booking confirmed!");
        } else {
            alert("No available seats.");
        }
    };

    return (
        <div className="confirmation-container">
            <h1>Confirm Your Booking</h1>
            <p><strong>From:</strong> {state?.from_place}</p>
            <p><strong>To:</strong> {state?.to_place}</p>
            <p><strong>Distance:</strong> {state?.distance} km</p>
            <p><strong>Available Seats:</strong> {passengers}</p>
            <button onClick={handleConfirmBooking} disabled={passengers < 1}>
                Confirm Booking
            </button>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
};

export default Confirmation;
