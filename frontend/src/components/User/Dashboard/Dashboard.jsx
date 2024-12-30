// Dashboard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faBus, faUsers } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";

const Dashboard = ({ trips }) => {
  const totalRoutes = new Set(trips.map((trip) => trip.from_place)).size;
  const totalDrivers = new Set(trips.map((trip) => trip.driver_name)).size;
  const totalVehicles = new Set(trips.map((trip) => trip.agency)).size;

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      <div className="card-container">
        <div className="card">
          <FontAwesomeIcon icon={faRoute} className="icon" />
          Total Trips: {totalRoutes}
        </div>
        <div className="card">
          <FontAwesomeIcon icon={faUsers} className="icon" />
          Drivers: {totalDrivers}
        </div>
        <div className="card">
          <FontAwesomeIcon icon={faBus} className="icon" />
          Vehicles: {totalVehicles}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
