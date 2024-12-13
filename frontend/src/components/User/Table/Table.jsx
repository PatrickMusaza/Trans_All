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
      (!filters.status || trip.status.includes(filters.status)) &&
      (!filters.driver || trip.driver_name.includes(filters.driver)) &&
      (!filters.location || trip.from_place.includes(filters.location) || trip.to_place.includes(filters.location)) &&
      (!filters.date || trip.date.includes(filters.date))
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
          placeholder="mm/dd/yy"
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
              <td>{trip.ride_no}</td>
              <td>{trip.date}</td>
              <td>{trip.from_place}</td>
              <td>{trip.to_place}</td>
              <td>{trip.departure_time}</td>
              <td>{trip.arrival_time}</td>
              <td>{trip.driver_name}</td>
              <td>{trip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
