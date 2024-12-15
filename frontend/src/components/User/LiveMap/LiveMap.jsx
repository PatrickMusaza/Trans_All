import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import "./LiveMap.css";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const LiveMapDetails = () => {
    const { state } = useLocation(); // Route details passed from the previous page
    const navigate = useNavigate();
    const [liveLocation, setLiveLocation] = useState({ lat: -1.9573, lng: 30.1127 });
    const passengerLocation = { lat: -1.9573, lng: 30.1127 };
    const [passengers, setPassengers] = useState(state?.vehicle.id.number_of_seats-state?.vehicle.passengers || 0);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with a valid API key
    });

    const fetchLaptopLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLiveLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error("Error fetching laptop location:", error);
            }
        );
    };

    useEffect(() => {
        fetchLaptopLocation();
        const interval = setInterval(fetchLaptopLocation, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleProceed = async () => {
        if (passengers > 1) {
            try {
                // Decrease passenger count locally
                setPassengers((prev) => prev - 1);

                // Update passenger count in backend (optional)
                await axiosInstance.put(`/api/vehicles/${state?.vehicle.id}/update/`, {
                    passengers: passengers - 1,
                });

                // Create order in backend
                await axiosInstance.post("/api/trips/", {
                    trip: state?.id,
                    client: 1, // Replace with logged-in user's ID
                });

                alert("Trip booked successfully!");
                navigate("/confirmation"); 
            } catch (error) {
                console.error("Error booking trip:", error);
                alert("Failed to book the trip. Please try again.");
            }
        } else {
            alert("No available seats.");
        }
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="live-map-details">
            <div className="live-map" style={{ flex: "7" }}>
                <h2>Live Location</h2>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={liveLocation}
                    zoom={12}
                >
                    <Marker position={liveLocation} label="Bus" />
                    <Marker position={passengerLocation} label="Passenger" />
                </GoogleMap>
            </div>

            <div className="details" style={{ flex: "3" }}>
                <h2>Trip Details</h2>
                <p><strong>From:</strong> {state?.from_place}</p>
                <p><strong>To:</strong> {state?.to_place}</p>
                <p><strong>Driver:</strong> {state?.driver_name}</p>
                <p><strong>Passengers:</strong> {state?.vehicle.id.passengers}</p>
                <p><strong>Price:</strong> RWF {state?.price}</p>
                <p><strong>Distance:</strong> {state?.distance} km</p>
                <p><strong>Average Speed:</strong> {state?.speed} km/h</p>
                <button onClick={() => window.history.back()}>Close</button>
                <button onClick={handleProceed}>Proceed</button>
            </div>
        </div>
    );
};

export default LiveMapDetails;
