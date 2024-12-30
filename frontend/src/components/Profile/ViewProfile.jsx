import React, { useEffect, useState } from "react";
import ProfileDetails from "./ProfileDetails";
import axiosInstance from "../../api/axios";
import profilePicture from "../../assets/images/pic.png";
import "./ViewProfile.css";

const ViewProfile = ({ onClose, token }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    sector: "",      // New field
    district: "",    // New field
  });

  const handleClose = () => {
    if (onClose) onClose();
  };

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
  }, [handleClose]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          password: "", // Password should not be pre-filled for security
          sector: response.data.sector || "", // Add sector field
          district: response.data.district || "", // Add district field
        });
      } catch (error) {
        setError("Failed to fetch user profile.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("api/users/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile.");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="popup-overlay">Loading...</div>;
  }

  if (error) {
    return <div className="popup-overlay">Error: {error}</div>;
  }

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="view-profile" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          X
        </button>
        {user && (
          <div className="profile-card">
            <img
              src={profilePicture}
              alt={`${user.first_name}'s avatar`}
              className="profile-avatar"
            />
            <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
            <p className="profile-email">Email: {user.email}</p>
            <button
              className="profile-edit-btn"
              onClick={handleEditToggle}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing && (
              <form className="edit-profile-form" onSubmit={handleSubmit}>
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                <button type="submit">Save Changes</button>
              </form>
            )}

            {user.details && (
              <ProfileDetails
                details={{
                  first_name: user.first_name,
                  last_name: user.last_name,
                  age: user.age,
                  street: user.street_number,
                  sector: user.sector,
                  district: user.district,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
