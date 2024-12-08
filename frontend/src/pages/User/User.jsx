import React, { useState, useEffect } from "react";
import Dashboard from "../../components/User/Dashboard/Dashboard";
import Routes from "../../components/User/Route/Routes";
import LiveMap from "../../components/User/LiveMap/LiveMap";
import Table from "../../components/User/Table/Table";
import "./User.css";

function User() {
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    // Fetch routes
    fetch("http://127.0.0.1:8000/api/routes/")
      .then((response) => response.json())
      .then((data) => setRoutes(data));

    // Fetch trips
    fetch("http://127.0.0.1:8000/api/trips/")
      .then((response) => response.json())
      .then((data) => setTrips(data));
  }, []);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  return (
    <div className="User">
      <Dashboard trips={trips} />
      <Routes routes={routes} onSelectRoute={handleRouteSelect} />
      {selectedRoute && <LiveMap route={selectedRoute} />}
      <Table trips={trips} />
    </div>
  );
}

export default User;
