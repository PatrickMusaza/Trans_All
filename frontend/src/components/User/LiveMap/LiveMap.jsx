import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import "./LiveMap.css";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const LiveMapDetails = () => {
    const { state } = useLocation(); // Route details passed from the previous page
    const [liveLocation, setLiveLocation] = useState({ lat: -1.9573, lng: 30.1127 }); // Kigali Downtown coordinates
    const passengerLocation = { lat: -1.9573, lng: 30.1127 }; // Kigali Downtown coordinates for reference

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "https://gist.github.com/RyanOkamuro/3829cde1b7db51a739c7ca5f11055c54.js", 
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
        fetchLaptopLocation(); // Fetch initial location

        // Update location every 5 seconds to simulate live tracking
        const interval = setInterval(fetchLaptopLocation, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="live-map-details">
            {/* Map Container */}
            <div className="live-map" style={{ flex: "7" }}>
                <h2>Live Location</h2>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={liveLocation}
                    zoom={12}
                >
                    {/* Marker for Bus Location */}
                    <Marker position={liveLocation} label="Bus" />

                    {/* Marker for Kigali Downtown */}
                    <Marker position={passengerLocation} label="Passenger" />
                </GoogleMap>
            </div>

            {/* Details Container */}
            <div className="details" style={{ flex: "3" }}>
                <h2>Trip Details</h2>
                <p><strong>From:</strong> {state?.from_place}</p>
                <p><strong>To:</strong> {state?.to_place}</p>
                <p><strong>Driver:</strong> {state?.driver_name}</p>
                <p><strong>Passengers:</strong> {state?.passengers}</p>
                <p><strong>Price:</strong> RWF {state?.price}</p>
                <p><strong>Distance:</strong> {state?.distance} km</p>
                <p><strong>Average Speed:</strong> {state?.speed} km/h</p>
                <button onClick={() => window.history.back()}>Close</button>
            </div>
        </div>
    );
};

export default LiveMapDetails;
