import React, { useEffect, useState } from 'react';
import './App.css';
import {io} from "socket.io-client";

function App() {
  const [input, setInput] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [color, setColor] = useState('#000000');
   const socket = io('http://localhost:3001');
    const [messages, setMessages] = useState([]);


  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the effect when the component unmounts
    return () => socket.off('message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: pseudo + ': ' + input, color: color };
      socket.emit('message', newMessage); // Emit the message to the server
      setInput(''); // Clear the input after sending
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>ChatBox</h1>
        </header>
        <div className="chat-box">
          <div className="messages">
            {messages.map((message, index) => (
                <div key={index} className="message" style={{ color: message.color }}>
                  {message.text}
                </div>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input
                type="color"
                value={color}
                className="color-picker"
                onChange={(e) => setColor(e.target.value)}
                title="Choisir votre couleur"
            />
            <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Pseudo"
            />
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrire un message..."
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      </div>
  );
}

export default App;
