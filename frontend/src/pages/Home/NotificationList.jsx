import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../../context/NotificationContext";

const NotificationList = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => removeNotification(n.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .notification-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 9999;
            width: 300px;
            max-width: 90%;
          }

          .notification {
            background-color: #444;
            color: white;
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 5px;
            font-size: 0.95rem;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          }

          .notification.success {
            background-color: #4caf50;
          }

          .notification.error {
            background-color: #f44336;
          }

          .notification.info {
            background-color: #2196f3;
          }

          .no-notification {
            text-align: center;
            font-weight: bold;
            color: #777;
            background-color: #f4f4f4;
            padding: 1rem;
            border-radius: 6px;
          }
        `}
      </style>

      {/* Notification List */}
      <div className="notification-container">
        {notifications.length === 0 ? (
          <div className="no-notification">No notification</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`notification ${n.type}`}>
              {n.message}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default NotificationList;
