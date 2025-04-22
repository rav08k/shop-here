import React from 'react';

const AllNotifications = () => {
  return (
    <div className="page-container">
      <h2 className="section-title">All Notifications</h2>
      <div className="empty-state">
        <div className="empty-state-icon">🔔</div>
        <div className="empty-state-message">No new notifications</div>
        <div className="empty-state-submessage">You're all caught up!</div>
      </div>
    </div>
  );
};

export default AllNotifications;