import React, { useState,  } from "react";
import "../homepage/HomePage.css";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username] = useState("");
  const [voiceText, setVoiceText] = useState("");


  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setVoiceText(text);
    };
  };

  const industries = [
    "Aerospace",
    "Agriculture",
    "Automotive",
    "Chemical",
    "Defense Technology",
    "Education",
    "Energy & Utilities",
    "Entertainment & Media",
    "Finance",
    "Food Technology",
    "Healthcare",
    "Infrastructure",
    "Logistics",
    "Manufacturing",
    "Ocean Technology",
    "Oil & Gas",
    "Pharmaceutical",
    "Retail",
    "Sports",
    "Technology",
    "Telecommunication",
    "Textile",
    "Transportation",
    "Travel",
  ];

  return (
    
    <div className="app">
        <div>
             <h2 className="logo">Aattral</h2>
          <h5 className="version">Version 0.1</h5>
        </div>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button
          className="toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <div className="sidebar-content">
           
          <button className="menu-item">New Chat</button>
          <button className="menu-item"> Media</button>

          <div className="recent-section">
            <h3>Recent Chats</h3>
            {/* <ul>
              <li>Autonomous Skies</li>
              <li>Zero-Downtime Aircrafts</li>
              <li>Simulating Space Missions</li>
              <li>Textile Quality Control</li>
              <li>Game Plan</li>
              <li>Color Psychology</li>
              <li>Wearable AI</li>
              <li>Fashion Forecasting</li>
            </ul> */}
          </div>

          <button className="settings-btn">⚙️ Setting & Help</button>
        </div>
      </div>

      {/* Main Section */}
      <div className="main">
        
        <header>
          <div className="user-profile">
            <div
              className="user-circle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {username[0]}
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
                <p>👤 View Profile</p>
                <p>⚙️ Settings</p>
                <p>🚪 Logout</p>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          <h1 className="hello">Hello, {username}</h1>
          <div className="search-bar">
            <button
              className="plus-btn"
              onClick={() => alert("Add photo / Choose from gallery")}
            >
              +
            </button>
            <input className="main-search-box"
              type="text"
              placeholder="Ask Aattral anything "
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
            />
            <button onClick={handleVoiceInput} className="mic-btn">
              🎤
            </button>
          </div>

          <div className="buttons">
            <button>🔍 Deep Research</button>
            <button>🖼️ Create Image</button>
            <button>🌐 Web Search</button>
          </div>

          <h2 className="industries-head">Industries</h2>
          <div className="industries">
            {industries.map((item, i) => (
              <span key={i} className="chip">
                {item}
              </span>
            ))}
          </div>
          <footer>Powered by Techbrain Networks</footer>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
