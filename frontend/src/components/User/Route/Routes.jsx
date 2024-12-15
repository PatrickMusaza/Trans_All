import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import "./Routes.css";

const Routes = () => {
    const [routes, setRoutes] = useState([]);
    const [fromPlace, setFromPlace] = useState("");
    const [toPlace, setToPlace] = useState("");
    const [distance, setDistance] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axiosInstance.get("/api/routes/");
                setRoutes(response.data);
            } catch (err) {
                console.error("Error fetching routes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const calculateDistance = () => {
        if (fromPlace && toPlace) {
            const route = routes.find(
                (route) => route.from_place === fromPlace && route.to_place === toPlace
            );
            setDistance(route ? route.distance : "Route not found");
        }
    };

    const handleCheckout = () => {
        const selectedRoute = routes.find(
            (route) => route.from_place === fromPlace && route.to_place === toPlace
        );

        if (selectedRoute) {
            navigate("/live-map", { state: selectedRoute }); // Pass route details via state
        } else {
            alert("Please select a valid route.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="route-container">
            <h1>Find a Route</h1>
            <div className="dropdown-container">
                <div className="dropdown">
                    <label>From:</label>
                    <select value={fromPlace} onChange={(e) => setFromPlace(e.target.value)}>
                        <option value="">Select</option>
                        {[...new Set(routes.map((route) => route.from_place))].map((place) => (
                            <option key={place} value={place}>
                                {place}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="dropdown">
                    <label>To:</label>
                    <select value={toPlace} onChange={(e) => setToPlace(e.target.value)}>
                        <option value="">Select</option>
                        {[...new Set(routes.map((route) => route.to_place))].map((place) => (
                            <option key={place} value={place}>
                                {place}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button className="calculate-button" onClick={calculateDistance} disabled={!fromPlace || !toPlace}>
                Calculate Distance
            </button>
            <button className="checkout-button" onClick={handleCheckout} disabled={!fromPlace || !toPlace}>
                Proceed
            </button>

            {distance && <p>Distance: {distance} km</p>}
        </div>
    );
};

export default Routes;
