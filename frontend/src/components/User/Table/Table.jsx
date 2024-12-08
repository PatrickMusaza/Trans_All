// Table.jsx
import React from "react";
import "./Table.css";

const Table = ({ trips }) => {
  return (
    <div className="table">
      <h2>Recent Trips</h2>
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
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.ride_no}</td>
              <td>{trip.date}</td>
              <td>{trip.from_place}</td>
              <td>{trip.to_place}</td>
              <td>{trip.departure_time}</td>
              <td>{trip.arrival_time}</td>
              <td>{trip.driver_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
