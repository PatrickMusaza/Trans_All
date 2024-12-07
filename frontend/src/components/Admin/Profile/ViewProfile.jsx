import React from "react";
import ProfileDetails from "./ProfileDetails";
import "./ViewProfile.css";

const ViewProfile = ({ user }) => {
  return (
    <div className="view-profile">
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
  );
};

export default ViewProfile;
