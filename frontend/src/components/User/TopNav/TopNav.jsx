import React, { useState } from "react";
import "./TopNav.css";
import busImage from "../../../assets/images/download.jpg";
import LogoutModal from "../../Logout/LogoutModal";
import ViewProfile from "../../Profile/ViewProfile";

const TopNav = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false); // Set initial state to false

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
    setCollapsed(!collapsed);
  };

  const showLogoutModal = () => setShowModal(true); // Show modal
  const closeLogoutModal = () => setShowModal(false); // Close modal

  const handleLogout = () => {
    window.location.href = "/sign-in";
  };

  const handleOpenProfile = () => {
    setIsProfileVisible(true); // Show the profile popup
  };

  const handleCloseProfile = () => {
    setIsProfileVisible(false); // Close the profile popup
  };

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://www.istockphoto.com/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration-gm1300845620-393045799", // Replace with your actual avatar path
    details: {
      // Add user details here
      bio: "Software Developer",
      location: "San Francisco, CA"
    }
  };

  return (
    <div className="top-nav">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          className="search-bar"
        />
      </div>|

      <div className="actions">
        <div className="notifications">
          <i className="fas fa-comment-dots"></i> {/* Message Icon */}
        </div>
        <div className="notifications">
          <i className="fas fa-bell"></i> {/* Notification Icon */}
        </div>
      </div>|

      <div className="user-profile" onClick={toggleProfileDropdown}>
        <img src={busImage} alt="Profile" />
        <div className="profile-info">
          <span className="name">M. Patrick</span>
          <span className="status">Admin</span>
        </div>
        <i className={`fas ${collapsed ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-details">
              <a href="/dashboard">Admin Mode</a>
              <button className="profile" onClick={handleOpenProfile}>View Profile</button>
              {isProfileVisible && (
                <ViewProfile user={user} onClose={handleCloseProfile} />
              )}
              <button onClick={showLogoutModal}>Logout</button> {/* Trigger Logout Modal */}
            </div>
          </div>
        )}
      </div>

      {/* Render the LogoutModal component outside of the profile dropdown */}
      <LogoutModal
        show={showModal}
        onClose={closeLogoutModal}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default TopNav;
