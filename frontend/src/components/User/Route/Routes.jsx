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
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axiosInstance.get("/api/routes/");
                setRoutes(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    const handleFromChange = (e) => {
        const selectedFrom = e.target.value;
        setFromPlace(selectedFrom);
        setDistance(null); // Reset distance

        // If 'toPlace' is already selected, recalculate the distance
        if (toPlace) {
            const selectedRoute = routes.find(
                (route) => route.from_place === selectedFrom && route.to_place === toPlace
            );
            setDistance(selectedRoute ? selectedRoute.distance : "Route not found");
        }
    };

    const handleToChange = (e) => {
        const selectedTo = e.target.value;
        setToPlace(selectedTo);
        setDistance(null); // Reset distance

        // If 'fromPlace' is already selected, recalculate the distance
        if (fromPlace) {
            const selectedRoute = routes.find(
                (route) => route.from_place === fromPlace && route.to_place === selectedTo
            );
            setDistance(selectedRoute ? selectedRoute.distance : "Route not found");
        }
    };

    const calculateDistance = () => {
        if (fromPlace && toPlace) {
            const selectedRoute = routes.find(
                (route) => route.from_place === fromPlace && route.to_place === toPlace
            );
            setDistance(selectedRoute ? selectedRoute.distance : "Route not found");
        }
    };

    const handleCheckout = () => {
        const selectedRoute = routes.find(
            (route) => route.from_place === fromPlace && route.to_place === toPlace
        );

        if (selectedRoute) {
            navigate("/live-map", { state: selectedRoute }); // Pass route details via state
        }
    };

    if (loading) return <div>Loading routes...</div>;
    if (error) return <div>Error: {error}</div>;

    const fromPlaces = [...new Set(routes.map((route) => route.from_place))];
    const toPlaces = [...new Set(routes.map((route) => route.to_place))];
    // Filter options dynamically
    const filteredToPlaces =
        fromPlace !== ""
            ? routes
                .filter((route) => route.from_place === fromPlace)
                .map((route) => route.to_place)
            : toPlaces;

    const filteredFromPlaces =
        toPlace !== ""
            ? routes
                .filter((route) => route.to_place === toPlace)
                .map((route) => route.from_place)
            : fromPlaces;

    return (
        <div className="route-container">
            <h1>Route Finder</h1>
            <div className="dropdown-container">
                <div className="dropdown">
                    <label htmlFor="from">From: </label>
                    <select id="from" value={fromPlace} onChange={handleFromChange}>
                        <option value="">Select a starting place</option>
                        {filteredFromPlaces.map((place) => (
                            <option key={place} value={place}>
                                {place}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="dropdown">
                    <label htmlFor="to">To: </label>
                    <select id="to" value={toPlace} onChange={handleToChange}>
                        <option value="">Select a destination</option>
                        {filteredToPlaces.map((place) => (
                            <option key={place} value={place}>
                                {place}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                className="calculate-button"
                onClick={calculateDistance}
                disabled={!fromPlace || !toPlace}
            >
                Calculate Distance
            </button>

            <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={!fromPlace || !toPlace}
            >
                Checkout
            </button>

            {distance !== null && <h3>Distance: {distance} km</h3>}
        </div>
    );
};

export default Routes;