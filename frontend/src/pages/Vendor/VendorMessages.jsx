// src/pages/Vendor/VendorMessages.jsx
import React, { useEffect, useState } from "react";
import { getMessages, createMessage } from "../../api/messageApi";

export default function VendorMessages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState("");

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    try {
      await createMessage(receiver, newMessage);
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vendor Messages</h1>
      <div>
        <input 
          placeholder="Receiver ID" 
          value={receiver} 
          onChange={(e) => setReceiver(e.target.value)} 
        />
        <input 
          placeholder="Message" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <ul>
        {messages.map(m => (
          <li key={m._id}>
            <strong>{m.senderName}:</strong> {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
