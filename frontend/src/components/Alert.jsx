import React from "react";

export default function Alert({ message, type = "info" }) {
  const bgColors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={`${bgColors[type]} text-white px-4 py-2 rounded mb-4`}>
      {message}
    </div>
  );
}
