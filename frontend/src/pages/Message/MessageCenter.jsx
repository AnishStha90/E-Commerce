import React from "react";

function MessageCenter({ messages = [] }) {
  return (
    <div style={styles.container}>
      {messages.length === 0 ? (
        <p style={styles.noMessages}>No messages yet</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))
      )}
    </div>
  );
}


const styles = {
  container: {
    height: "300px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px 4px 0 0",
    backgroundColor: "#f9f9f9",
  },
  message: {
    marginBottom: "10px",
  },
  noMessages: {
    color: "#999",
    textAlign: "center",
    marginTop: "130px",
  },
};

export default MessageCenter;
