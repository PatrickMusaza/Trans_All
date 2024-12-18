import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import './LiveMap.css';

const LiveMapDetails = () => {
  const { state } = useLocation();

  useEffect(() => {
    console.log("Received state in LiveMapDetails:", state);
  }, [state]);

  const navigate = useNavigate();
  const { lat, log } = state?.vehicle || { lat: 0, log: 0 };

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.log("Failed to fetch user profile."); 
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleProceed = async () => {
    setLoading(true); // Indicate loading state
    setLoading(false); // Reset loading state
  
    // Validate user
    if (!user || !user.id) {
      alert("User information could not be loaded. Please try again.");
      return;
    }
  
    // Validate vehicle and route details
    if (!state?.vehicle || !state?.route) {
      alert("Vehicle or route information is missing. Please check your selection.");
      return;
    }
  
    const availableSeats = state.vehicle.number_of_seats - state.vehicle.passengers;
    if (availableSeats <= 0) {
      alert("No available seats.");
      return;
    }
  
    try {
      // Create trip payload
      const tripPayload = {
        route_id: { id: state.route.id }, // Send as object with nested ID
        vehicle_id: { id: state.vehicle.id }, // Send as object with nested ID
        driver_id: { id: state.vehicle.id }, // Send as object with nested ID
        driver: "Driver", // Send as object with nested ID
        date: "12/12/2024", // Current date
        departure_time: "08:00:00", // Placeholder
        arrival_time: "10:00:00", // Placeholder
        agency: "Default Agency", // Placeholder
        status: "pending",
      };
      
  
      const tripResponse = await axiosInstance.post("api/trips/add/", tripPayload);
      const trip = tripResponse.data;
  
      // Create order payload
      const orderPayload = {
        trip: trip.id,
        client: user.id,
      };
  
      const orderResponse = await axiosInstance.post("/api/orders/add/", orderPayload);
      const order = orderResponse.data;
  
      // Update vehicle passenger count
      const updatedPassengers = state.vehicle.passengers + 1;
      await axiosInstance.put(`/api/vehicles/${state.vehicle.id}/update/`, {
        passengers: updatedPassengers,
      });
  
      // Notify success
      alert(`Trip booked successfully! Order ID: ${order.id}`);
      navigate("/confirm");
    } catch (error) {
      console.error("Error booking trip:", error.response?.data || error.message);
      alert("Failed to book the trip. Please try again.");
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="live-map-details">
      <div className="map-container">
        <iframe
          title="Google Map"
          width="300%"
          height="500"
          src={`https://www.google.com/maps?q=${lat},${log}&hl=es;z=13&output=embed`}
          frameBorder="0"
          style={{ border: "0" }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>

      <div className="details">
        <h2>Trip Details</h2>
        <p><strong>From:</strong> {state?.route?.from_place}</p>
        <p><strong>To:</strong> {state?.route?.to_place}</p>
        <p><strong>Vehicle:</strong> {state?.vehicle?.license_plate}</p>
        <p><strong>Seats:</strong> {state?.vehicle?.passengers}/{state?.vehicle?.number_of_seats}</p>
        <p><strong>Price:</strong> RWF {state?.route?.price}</p>
        <p><strong>Distance:</strong> {state?.route?.distance} km</p>
        <button onClick={() => navigate(-1)}>Close</button>
        <button onClick={handleProceed}>Book Now</button>
      </div>
    </div>
  );
};

export default LiveMapDetails;
