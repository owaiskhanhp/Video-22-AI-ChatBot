import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([
   
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // NEW: Loading state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll when loading starts too

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (data) => {
      const aiResponse = {
        id: Date.now(),
        text: data,
        sender: "ai"
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false); // STOP LOADING when data arrives
    });

    return () => socketInstance.disconnect();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    setIsLoading(true); // START LOADING
    socket.emit("ai-message", userMessage.text);
  };

  return (
    <div className="dark-theme-wrapper">
      <div className="chatgpt-container">
        <header className="mobile-header">
          <span>ChatGPT 4.0</span>
          <button className="new-chat-btn" onClick={() => setMessages([])}>+</button>
        </header>

        <div className="chat-window">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              <div className="avatar">
                {msg.sender === "ai" ? "GPT" : "U"}
              </div>
              <div className="bubble">{msg.text}</div>
            </div>
          ))}

          {/* LOADING INDICATOR */}
          {isLoading && (
            <div className="message-row ai">
              <div className="avatar ai-glow">GPT</div>
              <div className="bubble loading-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="bottom-section">
          <form className="input-pill" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Message ChatGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading} // Disable input while waiting
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
              {isLoading ? "..." : "↑"}
            </button>
          </form>
          <p className="footer-note">ChatGPT can make mistakes.</p>
        </div>
      </div>
    </div>
  );
}

export default App;