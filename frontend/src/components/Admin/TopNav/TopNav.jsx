import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import busImage from "../../../assets/images/download.jpg";
import LogoutModal from "../../Logout/LogoutModal";
import ViewProfile from "../../Profile/ViewProfile";
import "./TopNav.css";

const TopNav = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
    setCollapsed(!collapsed);
  };

  const handleOpenProfile = () => {
    setIsProfileVisible(true);
  };

  const handleCloseProfile = () => {
    setIsProfileVisible(false); 
  };

  const showLogoutModal = () => setShowModal(true); 
  const closeLogoutModal = () => setShowModal(false); 

  const handleLogout = () => {
    window.location.href = "/sign-in";
  };
  /*
    const user = {
      avatar: "https://via.placeholder.com/120",
      name: "John Doe",
      email: "john.doe@example.com",
      details: {
        Address: "123 Main Street, Springfield",
        Phone: "+1 234 567 890",
        "Date of Birth": "1990-01-01",
        "Membership Status": "Gold Member",
      },
    };
  */

  useEffect(() => {

    const token = localStorage.getItem("token"); 

    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user profile.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


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
        {user && (
          <div className="profile-info">
            <span className="name">{user.first_name}</span>
            <span className="status">{user.role}</span>
          </div>
        )}
        <i className={`fas ${collapsed ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-details">
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
