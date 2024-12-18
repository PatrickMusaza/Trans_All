import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios"; // Update the import as necessary
import "./Routes.css";

const Routes = () => {
    const [routes, setRoutes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [fromPlace, setFromPlace] = useState("");
    const [toPlace, setToPlace] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axiosInstance.get("/api/routes/");
                setRoutes(response.data);
            } catch (err) {
                console.error("Error fetching routes:", err);
            }
        };

        fetchRoutes();
        setLoading(false);
    }, []);

    // Fetch vehicles based on selected route
    useEffect(() => {
        const fetchVehicles = async () => {
            if (fromPlace && toPlace) {
                try {
                    // Fetch vehicles based on the selected fromPlace and toPlace
                    const response = await axiosInstance.get(`/api/moved/?from_place=${fromPlace}&to_place=${toPlace}`);
                    setVehicles(response.data);  // Set vehicles fetched based on route
                } catch (err) {
                    console.error("Error fetching vehicles:", err);
                }
            }
        };

        fetchVehicles();
    }, [fromPlace, toPlace]);

    const handleRowClick = (vehicle) => {
        
        if (!vehicle || !vehicle.route) {
          console.error("Invalid vehicle or route data:", vehicle);
          alert("Unable to load trip details. Please try again.");
          return;
        }
      
        navigate("/live-map", {
          state: {
            route: vehicle.route, 
            vehicle: vehicle.vehicle,     
          },
        });
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
                            <option key={place} value={place}>{place}</option>
                        ))}
                    </select>
                </div>

                <div className="dropdown">
                    <label>To:</label>
                    <select value={toPlace} onChange={(e) => setToPlace(e.target.value)}>
                        <option value="">Select</option>
                        {[...new Set(routes.map((route) => route.to_place))].map((place) => (
                            <option key={place} value={place}>{place}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Distance</th>
                        <th>Available Seats</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (<tr key={vehicle.vehicle.id} onClick={() => handleRowClick(vehicle)}>
                            <td>{vehicle.vehicle.license_plate}</td>
                            <td>{vehicle.route.from_place}</td>
                            <td>{vehicle.route.to_place}</td>
                            <td>{vehicle.route.distance} KM</td>
                            <td>{vehicle.vehicle.number_of_seats - vehicle.vehicle.passengers}</td>
                            <td>
                                {vehicle.vehicle.number_of_seats > vehicle.vehicle.passengers ? (
                                    <button className="book-button">Book</button>
                                ) : (
                                    <span>Full</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Routes;
