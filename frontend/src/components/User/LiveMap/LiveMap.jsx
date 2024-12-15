import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import "./LiveMap.css";

const LiveMapDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [trip, setTrip] = useState({}); // Default to an empty object
    const [liveLocation, setLiveLocation] = useState({ lat: 0, lng: 0 }); // Default coordinates

    const fetchTripData = async () => {
        try {
            const response = await axiosInstance.get(`api/trips/${state?.id}/`);
            const tripData = response.data;

            // Update state
            setTrip(tripData);
            setLiveLocation({
                lat: tripData.vehicle?.lat || 0,
                lng: tripData.vehicle?.lng || 0,
            });
        } catch (err) {
            console.error("Error fetching trip data:", err);
        }
    };

    useEffect(() => {
        fetchTripData();

        // Set interval to refresh live location every 5 seconds
        const interval = setInterval(fetchTripData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleProceed = async () => {
        if (trip?.vehicle?.number_of_seats - trip?.vehicle?.passengers > 0) {
            try {
                await axiosInstance.post("/api/rides/add/", {
                    trip: state?.id,
                    client: 1, //dummy id
                });
                alert("Trip booked successfully!");
                navigate("/users");
            } catch (error) {
                console.error("Error booking trip:", error);
                alert("Failed to book the trip. Please try again.");
            }
        } else {
            alert("No available seats.");
        }
    };

    return (
        <div className="live-map-details">
            <div className="live-map" style={{ flex: "7" }}>
                <h2>Live Location</h2>
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps?q=${liveLocation.lat},${liveLocation.lng}&z=15&output=embed`}
                    allowFullScreen
                    title="Live Map"
                ></iframe>
            </div>

            <div className="details" style={{ flex: "3" }}>
                <h2>Trip Details</h2>
                <p><strong>From:</strong> {trip?.route.from_place || "N/A"}</p>
                <p><strong>To:</strong> {trip?.route.to_place || "N/A"}</p>
                <p><strong>Driver:</strong> {trip?.driver.first_name || "N/A"}</p>
                <p><strong>Passengers:</strong> {trip?.vehicle?.passengers || 0}/{trip?.vehicle?.number_of_seats || 0}</p>
                <p><strong>Price:</strong> RWF {trip?.price || "N/A"}</p>
                <p><strong>Distance:</strong> {trip?.route.distance || "N/A"} km</p>
                <p><strong>Average Speed:</strong> {trip?.speed || "N/A"} km/h</p>
                <button onClick={() => navigate(-1)}>Close</button>
                <button onClick={handleProceed}>Proceed</button>
            </div>
        </div>
    );
};

export default LiveMapDetails;
