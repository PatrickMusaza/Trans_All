import React from "react";
import './RecentTripTable.css';

const RecentTripsTable = () => {
  const trips = [
    { id: 1, date: "2024-11-20", destination: "Airport", fare: "$50" },
    { id: 2, date: "2024-11-21", destination: "City Center", fare: "$35" },
    { id: 3, date: "2024-11-22", destination: "Mall", fare: "$20" },
  ];

  return (
    <table className="recent-trips-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Destination</th>
          <th>Fare</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((trip) => (
          <tr key={trip.id}>
            <td>{trip.date}</td>
            <td>{trip.destination}</td>
            <td>{trip.fare}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentTripsTable;
