import React, { useEffect, useState } from "react";
import "./SummaryCard.css";

const Overview = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format Time
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      // Format Date
      const date = now.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
      setCurrentDate(date);

      // Format Day
      const day = now.toLocaleString('en-GB', { weekday: 'long' });
      setCurrentDay(day);
    };

    const intervalId = setInterval(updateDateTime, 1000); // Update every second
    updateDateTime(); // Initialize time and date immediately

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const stats = [
    { label: "TOTAL USERS", value: 400, details: "ACTIVE 220, UNACTIVE 180" },
    { label: "TOTAL ROUTES", value: 180, details: "(Inside Kigali)" },
    { label: "TOTAL DRIVERS", value: 195, details: "ACTIVE 115, UNACTIVE 80" },
    { label: "SUCCESSFUL ROUTES", value: 150, details: "Go to details", cols: "green" },
    { label: "PENDING ROUTES", value: 15, details: "Go to details", cols: "yellow" },
    { label: "CANCELLED ROUTES", value: 25, details: "Go to details", cols: "red" },
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
            className={`stat-card ${stat.cols}`} // Corrected syntax for dynamic class
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
