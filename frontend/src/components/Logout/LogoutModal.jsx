import React from "react";
import { Navigate } from "react-router-dom";
import "./Logout.css";


function Logout() {
  localStorage.clear()
  return <Navigate to='/sign-in' />
}

const LogoutModal = ({ show, onClose, onLogout }) => {
  if (!show) return null;

  if (onLogout) {
    Logout()
  }

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
