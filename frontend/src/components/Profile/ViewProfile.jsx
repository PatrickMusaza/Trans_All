import React, { useEffect } from "react";
import ProfileDetails from "./ProfileDetails";
import "./ViewProfile.css";

const ViewProfile = ({ user, onClose }) => {
  const handleClose = () => {
    if (onClose) onClose(); // Call the onClose function passed from the parent
  };

  // Close the popup when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="view-profile" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          X
        </button>
        <div className="profile-card">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={`${user.name}'s avatar`}
            className="profile-avatar"
          />
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <button
            className="profile-edit-btn"
            onClick={() => alert("Edit profile functionality here!")}
          >
            Edit Profile
          </button>
        </div>

        <ProfileDetails details={user.details} />
      </div>
    </div>
  );
};

export default ViewProfile;
