import React from "react";
import "./ProfileDetails.css";

const ProfileDetails = ({ details }) => {
  return (
    <div className="profile-details">
      <h3>Profile Details</h3>
      <ul>
        {Object.keys(details).map((key) => (
          <li key={key} className="detail-item">
            <span className="detail-key">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
            <span className="detail-value">{details[key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileDetails;
