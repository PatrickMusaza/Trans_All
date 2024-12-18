import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import './LiveMap.css';

const LiveMapDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { lat, lng } = state?.vehicle || { lat: 0, lng: 0 };
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // To store user data
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('api/users/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data); // Set user data
        } else {
          console.error('Failed to fetch user profile:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false); // If no token, set loading to false
    }
  }, [token]);

  // Fetch trip data
  const fetchTripData = async () => {
    try {
      const response = await axiosInstance.get(`/api/trips/${state?.id}/`);
      setTrip(response.data);
    } catch (err) {
      console.error("Error fetching trip data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, []);

  const handleProceed = async () => {
    if (trip?.vehicle?.number_of_seats - trip?.vehicle?.passengers > 0 && user) {
      try {
        // Book the ride for the logged-in user
        await axiosInstance.post("/api/rides/add/", {
          trip: state?.id,
          client: user.id, // Use the logged-in user's ID
        });

        // Update the trip status
        await axiosInstance.put(`/api/trips/${state?.id}/update/`, {
          status: "pending",
        });

        alert("Trip booked successfully!");
        navigate("/users");  // Navigate to users page or appropriate page
      } catch (error) {
        console.error("Error booking trip:", error);
        alert("Failed to book the trip. Please try again.");
      }
    } else {
      alert("No available seats or user not logged in.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!trip) {
    return <p>Error loading trip details. Please try again.</p>;
  }

  return (
    <div className="live-map-details">
      <div className="map-container">
        <iframe
          title="Google Map"
          width="100%"
          height="500"
          src={`https://www.google.com/maps?q=${lat},${lng}&hl=es;z=13&output=embed`}
          frameBorder="0"
          style={{ border: "0" }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>

      <div className="details" style={{ flex: "3" }}>
        <h2>Trip Details</h2>
        <p><strong>From:</strong> {trip?.route?.from_place}</p>
        <p><strong>To:</strong> {trip?.route?.to_place}</p>
        <p><strong>Driver:</strong> {trip?.driver?.first_name}</p>
        <p><strong>Seats:</strong> {trip?.vehicle?.passengers}/{trip?.vehicle?.number_of_seats}</p>
        <p><strong>Price:</strong> RWF {trip?.price}</p>
        <p><strong>Distance:</strong> {trip?.route?.distance} km</p>
        <button onClick={() => navigate(-1)}>Close</button>
        <button onClick={handleProceed}>Book Now</button>
      </div>
    </div>
  );
};

export default LiveMapDetails;
