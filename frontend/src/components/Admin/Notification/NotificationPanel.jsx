import React, { useState } from "react";
import "./NotificationPanel.css"; // Optional: Add styles for better UI

const NotificationPanel = ({ tableData, summaryField, detailField }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Handle opening the detail modal
  const handleReadMore = (notification) => {
    setSelectedNotification(notification);
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="notification-panel">
      <h2>Notifications</h2>
      <div className="notifications">
        {tableData.map((item, index) => (
          <div key={index} className="notification-item">
            <p className="summary">
              {item[summaryField]} {/* Display the summary */}
            </p>
            <button
              className="read-more-btn"
              onClick={() => handleReadMore(item)}
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* Modal for detailed notification */}
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
