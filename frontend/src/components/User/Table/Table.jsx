import React, { useState } from "react";
import "./Table.css";

const Table = ({ trips }) => {
  const [filters, setFilters] = useState({
    status: "",
    driver: "",
    location: "",
    date: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredTrips = trips.filter((trip) => {
    return (
      (!filters.status || trip.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
      (!filters.driver || trip.driver.driver_name?.toLowerCase().includes(filters.driver.toLowerCase())) &&
      (!filters.location ||
        trip.route.from_place?.toLowerCase().includes(filters.location.toLowerCase()) ||
        trip.route.to_place?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.date || trip.date === filters.date)
    );
  });

  return (
    <div className="table">
      <h1>Recent Trips</h1>
      <div className="filters">
        <input
          type="text"
          name="status"
          placeholder="Filter by status"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="driver"
          placeholder="Filter by driver"
          value={filters.driver}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Ride No</th>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Driver</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.id}</td>
              <td>{trip.date}</td>
              <td>{trip.route.from_place}</td>
              <td>{trip.route.to_place}</td>
              <td>{trip.departure_time}</td>
              <td>{trip.arrival_time}</td>
              <td>{trip.driver.first_name}</td>
              <td>{trip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
