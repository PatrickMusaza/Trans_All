import React from "react";
import "./Logout.css"; 

const LogoutModal = ({ show, onClose, onLogout }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>You're about to Logout. Are you sure?</h3>
        <button className="btn btn-warning" onClick={onLogout}>Logout</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default LogoutModal;
