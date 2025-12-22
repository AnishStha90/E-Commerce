import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info") =>
    setNotifications([...notifications, { message, type, id: Date.now() }]);

  const removeNotification = (id) =>
    setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
