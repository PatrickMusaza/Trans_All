import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import "./SummaryCard.css";

const Overview = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [cancelledRoutes, setCancelledRoutes] = useState(0);
  const [pendingRoutes, setPendingRoutes] = useState(0);
  const [successfulRoutes, setSuccessfulRoutes] = useState(0);

  // Fetch trips, drivers, and users
  useEffect(() => {
    // Fetch trips
    axiosInstance.get("api/trips/")
      .then((response) => {
        setTrips(response.data);
        setCancelledRoutes(response.data.filter((trip) => trip.status === "Cancelled").length);
        setPendingRoutes(response.data.filter((trip) => trip.status === "Pending").length);
        setSuccessfulRoutes(response.data.filter((trip) => trip.status === "Completed").length);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });

    // Fetch drivers
    axiosInstance.get("api/drivers/")
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });

    // Fetch users (assuming you have a users endpoint)
    axiosInstance.get("api/users/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    // Update Date and Time
    const updateDateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      const date = now.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
      setCurrentDate(date);
      
      const day = now.toLocaleString('en-GB', { weekday: 'long' });
      setCurrentDay(day);
    };

    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime();

    return () => clearInterval(intervalId); 
  }, []);

  // Calculate stats dynamically
  const stats = [
    {
      label: "TOTAL USERS", 
      value: users.length, 
      details: `ACTIVE ${users.filter((user) => user.status === "active").length}, UNACTIVE ${users.filter((user) => user.status === "inactive").length}`
    },
    { 
      label: "TOTAL ROUTES", 
      value: trips.length, 
      details: "(Inside Kigali)" 
    },
    { 
      label: "TOTAL DRIVERS", 
      value: drivers.length, 
      details: `ACTIVE ${drivers.filter((driver) => driver.status === "active").length}, UNACTIVE ${drivers.filter((driver) => driver.status === "inactive").length}`
    },
    { 
      label: "SUCCESSFUL ROUTES", 
      value: successfulRoutes, 
      details: "Go to details", 
      cols: "green" 
    },
    { 
      label: "PENDING ROUTES", 
      value: pendingRoutes, 
      details: "Go to details", 
      cols: "yellow" 
    },
    { 
      label: "CANCELLED ROUTES", 
      value: cancelledRoutes, 
      details: "Go to details", 
      cols: "red" 
    }
  ];

  return (
    <div className="overview">
      <h2 className="overview-title">Dashboard Overview</h2>
      <div className="time-date">
        <p className="current-day">{currentDay},</p>
        <p className="current-date">{currentDate},</p>
        <p className="current-time">{currentTime}</p>
      </div>
      <div className="stat-cards">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`stat-card ${stat.cols}`} 
          >
            <h3>{stat.label}</h3>
            <h1>{stat.value}</h1>
            <p>{stat.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
