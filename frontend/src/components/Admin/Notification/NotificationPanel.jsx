import React, { useState } from "react";
import axiosInstance from "../../../api/axios";
import "./NotificationPanel.css";

const NotificationPanel = ({ tableData, summaryField, detailField }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleReadMore = (notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = async () => {
    if (selectedNotification) {
      const updatedNotification = {
        ...selectedNotification,
        status: true,
      };

      try {
        await axiosInstance.put(`api/messages/${selectedNotification.id}/update/`, updatedNotification);
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }

    setSelectedNotification(null);
  };

  return (
    <div className="notification-panel">
      <h2>Notifications</h2>
      <div className="notifications">
        {tableData.length > 0 ? (
          tableData.map((item) => (
            <div key={item.id} className="notification-item">
              <div className="notification-details">
                <p className="summary">{item[summaryField]}</p>
                <p className="time-sent">{item.sent_at}</p>
                <p className={`status ${item.status ? "read" : "unread"}`}>
                  {item.status ? "Read" : "Unread"}
                </p>
              </div>
              <button
                className="read-more-btn"
                onClick={() => handleReadMore(item)}
              >
                Read More
              </button>
            </div>
          ))
        ) : (
          <div className="data-container-error">
            <i className="fa-solid fa-database"></i>
            <h6>No data yet</h6>
          </div>
        )}
      </div>

      {selectedNotification && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Details</h3>
            <p>{selectedNotification[detailField]}</p>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
