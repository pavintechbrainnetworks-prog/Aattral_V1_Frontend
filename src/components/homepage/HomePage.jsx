import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css';
import media from '../../assets/media.png';
import newchat from '../../assets/newchat.png';
import menu from '../../assets/menu.png';
import search from '../../assets/search.png';
import settings from '../../assets/settings.png';
import imagesearch from '../../assets/imagesearch.png';
import deepsearch from '../../assets/deepsearch.png';
import websearch from '../../assets/websearch.png';
import mic from '../../assets/mic.png';
import plus from '../../assets/plus.png';

/**
 * Single-file React component implementing the requested homepage behaviors.
 *
 * Notes:
 * - Screenshot uses navigator.mediaDevices.getDisplayMedia (user picks screen or window).
 * - Camera uses navigator.mediaDevices.getUserMedia.
 * - Speech uses Web Speech API (SpeechRecognition). Feature-detect and fallback.
 */

export default function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState([
    "Autonomous Skies",
    "Zero-Downtime Aircrafts",
    "Simulating Space Missions",
    "Textile Quality Control",
    "Game Plan",
    "Color Psychology",
    "Wearable AI",
    "Predictions Tourist Hotspots",
    "Fashion Forecasting",
    "Lost in Translation",
  ]);
  const [uploaded, setUploaded] = useState([]); // {id, name, url, type}
  const [username, setUsername] = useState("Guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [plusOpen, setPlusOpen] = useState(false);
  const _fileInputRef = useRef(null);
  const hiddenFileRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

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

  // Load authenticated user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUsername(user.name || "User");
        setIsLoggedIn(true);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    // Setup SpeechRecognition if available
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = true;
      r.lang = "en-US";
      r.onresult = (e) => {
        let text = "";
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setSearchText(text);
      };
      r.onend = () => {
        setListening(false);
      };
      recognitionRef.current = r;
    }
    return () => {
      // cleanup
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore error if recognition has already stopped
        }
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  function handleFileInput(e) {
    const files = Array.from(e.target.files || []);
    const items = files.map((f) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const url = URL.createObjectURL(f);
      return { id, name: f.name, url, type: f.type };
    });
    setUploaded((u) => [...items, ...u]);
    // also add a recent chat item for the upload action
    if (files.length) {
      setRecentChats((r) => [files[0].name, ...r.filter((x) => x !== files[0].name)]);
    }
    // reset input value to allow re-uploading same file later
    e.target.value = "";
  }

  function openFilePicker() {
    if (hiddenFileRef.current) hiddenFileRef.current.click();
  }

  function removeUploaded(id) {
    setUploaded((u) => {
      const found = u.find((x) => x.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return u.filter((x) => x.id !== id);
    });
  }

  function onSearchKeyDown(e) {
    if (e.key === "Enter") {
      const q = searchText.trim();
      if (!q) return;
      // add to recent chats (search history)
      setRecentChats((r) => [q, ...r.filter((x) => x !== q)]);
      // add small "fake" chat preview as a file-like preview (optional)
    }
  }

  async function takeScreenshot() {
    // Use getDisplayMedia to capture a screenshot of screen/window (user selects)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const _track = stream.getVideoTracks()[0];
      const image = await captureFrameFromStream(stream);
      // stop tracks
      stream.getTracks().forEach((t) => t.stop());
      addBlobAsPreview(image, "screenshot.png", "image/png");
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert("Unable to take screenshot (permission denied or unsupported).");
    }
  }

  // helper: capture first frame of a MediaStream to blob
  function captureFrameFromStream(stream) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.style.position = "fixed";
      video.style.left = "-10000px";
      video.autoplay = true;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      };
    });
  }

  function addBlobAsPreview(blob, name, type) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const url = URL.createObjectURL(blob);
    setUploaded((u) => [{ id, name, url, type }, ...u]);
    setRecentChats((r) => [name, ...r.filter((x) => x !== name)]);
  }

  // open camera modal
  async function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported in this browser.");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(s);
      setCameraOpen(true);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = s;
        cameraVideoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      alert("Could not open camera (permission denied).");
    }
  }

  function captureFromCamera() {
    if (!cameraVideoRef.current) return;
    const video = cameraVideoRef.current;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      addBlobAsPreview(blob, "camera-photo.png", "image/png");
    }, "image/png");
    // close camera
    closeCamera();
  }

  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
    setCameraStream(null);
    setCameraOpen(false);
  }

  function toggleMic() {
    const r = recognitionRef.current;
    if (!r) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (!listening) {
      try {
        r.start();
        setListening(true);
      } catch (err) {
        console.warn("Could not start recognition", err);
      }
    } else {
      r.stop();
      setListening(false);
    }
  }

  function onIndustryClick(tag) {
    setSearchText(`Ask Aattral anything about ${tag}`);
    // optionally add to recent chats
  }

  function onProfileClick(action) {
    if (action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUsername("");
      navigate("/sign-in");
    }
    if (action === "profile") {
      alert("Open profile (demo).");
    }
    if (action === "settings") {
      alert("Open settings (demo).");
    }
  }

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Hidden File Input */}
        <input
          ref={hiddenFileRef}
          className="file-input"
          type="file"
          onChange={handleFileInput}
          multiple
          accept="image/*,video/*,application/pdf,*/*"
          style={{ display: "none" }}
        />

        {sidebarOpen ? (
          /* ========================================================
             OPEN STATE (Matches media_1794844049475_3429e61c.png)
             ======================================================== */
          <div className="sidebar-open-content">
            {/* Top row: Toggle on left, Search on right */}
            <div className="sidebar-open-top">
              <button
                className="sidebar-rail-btn"
                onClick={toggleSidebar}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <svg
                  width="25"
                  height="20"
                  viewBox="0 0 25 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.2"
                    y="1.2"
                    width="22.6"
                    height="17.6"
                    rx="4.8"
                    stroke="#192a56"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M1.2 5.5C1.2 3.1 3.1 1.2 5.5 1.2H8.5V18.8H5.5C3.1 18.8 1.2 16.9 1.2 14.5V5.5Z"
                    fill="#192a56"
                  />
                </svg>
              </button>

              <button
                className="sidebar-search-btn"
                onClick={() => {
                  const el = document.querySelector(".search-input");
                  if (el) el.focus();
                }}
                title="Search"
                aria-label="Search"
              >
                <img className="sidebar-search-img" src={search} alt="Search" />
              </button>
            </div>

            {/* Actions: New Chat & Media */}
            <div className="sidebar-open-actions">
              <button
                className="sidebar-open-action-btn"
                onClick={() => setSearchText("")}
              >
                <svg
                  className="action-icon-svg"
                  width="20"
                  height="20"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.2"
                    y="1.2"
                    width="19.6"
                    height="19.6"
                    rx="4.5"
                    stroke="#192a56"
                    strokeWidth="2"
                  />
                  <path
                    d="M11 6V16M6 11H16"
                    stroke="#192a56"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>New Chat</span>
              </button>

              <button
                className="sidebar-open-action-btn"
                onClick={() => hiddenFileRef.current?.click()}
              >
                <img className="action-icon-img" src={media} alt="Media" />
                <span>Media</span>
              </button>
            </div>

            {/* Recent Chats Section */}
            <div className="sidebar-recent-section">
              <div className="sidebar-recent-heading">Recent Chats</div>
              <div className="sidebar-recent-list" role="list">
                {recentChats.map((c, i) => (
                  <div
                    key={i}
                    className="sidebar-recent-item"
                    onClick={() => setSearchText(c)}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Setting & Help pill */}
            <div className="sidebar-open-bottom">
              <button
                className="sidebar-setting-help-pill"
                onClick={() => onProfileClick("settings")}
              >
                <img
                  className="setting-pill-icon"
                  src={settings}
                  alt="Settings"
                />
                <span>Setting & Help</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             CLOSED STATE (Matches media_1794843393175_93876f06.png)
             ======================================================== */
          <div className="sidebar-rail-content">
            <div className="sidebar-rail-top">
              {/* 1. Toggle Sidebar Icon */}
              <button
                className="sidebar-rail-btn"
                onClick={toggleSidebar}
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <svg
                  width="25"
                  height="20"
                  viewBox="0 0 25 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.2"
                    y="1.2"
                    width="22.6"
                    height="17.6"
                    rx="4.8"
                    stroke="#192a56"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M1.2 5.5C1.2 3.1 3.1 1.2 5.5 1.2H8.5V18.8H5.5C3.1 18.8 1.2 16.9 1.2 14.5V5.5Z"
                    fill="#192a56"
                  />
                </svg>
              </button>

              {/* 2. New Chat [+] Icon */}
              <button
                className="sidebar-rail-btn"
                onClick={() => setSearchText("")}
                title="New Chat"
                aria-label="New Chat"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.2"
                    y="1.2"
                    width="19.6"
                    height="19.6"
                    rx="4.5"
                    stroke="#192a56"
                    strokeWidth="2"
                  />
                  <path
                    d="M11 6V16M6 11H16"
                    stroke="#192a56"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* 3. Media Icon */}
              <button
                className="sidebar-rail-btn"
                onClick={() => hiddenFileRef.current?.click()}
                title="Media"
                aria-label="Media"
              >
                <img className="sidebar-rail-img" src={media} alt="Media" />
              </button>
            </div>

            <div className="sidebar-rail-bottom">
              <button
                className="sidebar-settings-circle"
                onClick={() => onProfileClick("settings")}
                title="Setting & Help"
                aria-label="Setting & Help"
              >
                <img
                  className="sidebar-settings-img"
                  src={settings}
                  alt="Settings"
                />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main area */}
      <main className="main">
        {/* Mobile menu toggle button */}
        <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu" title="Menu">
          <img className="main-icons" src={menu} alt="menu" />
        </button>

        {/* Logo - shifts when sidebar closed via CSS sibling selector */}
        <div className="logo" title="Aattral">
          Aattral <span className="version">Version 0.1</span>
        </div>

        {/* Profile avatar top-right */}
        <div className="profile-area">
          <div className="avatar" title={isLoggedIn ? username : "Guest"}>
            {isLoggedIn ? (username[0] || "U").toUpperCase() : "G"}
            <div className="profile-menu">
              <button onClick={() => onProfileClick("profile")}>Profile</button>
              <button onClick={() => onProfileClick("settings")}>Settings</button>
              <button onClick={() => onProfileClick("logout")}>Logout</button>
            </div>
          </div>
        </div>

        <h1 className="hello">Hello, {isLoggedIn ? username : "Guest"}</h1>

        {/* Search Box */}
        <div className="search-row">
          <div className="search-box">
            <input className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Ask Aattral anything about Aerospace Industry"
            />

            {/* Right-side plus that opens three options */}
            <div className="input-icons">
            <div className="plus-wrapper">
              <button
                className="plus-btn"
                onClick={() => setPlusOpen((p) => !p)}
                title="Add"
              >
                <img className="plus-icon"  src={plus} alt="plus" />
              </button>
              {plusOpen && (
                <div className="plus-menu">
                  <button className="plus-menu-item"
                    onClick={() => {
                      openFilePicker();
                      setPlusOpen(false);
                    }}
                  >
                   Add photos & files
                  </button>
                  <button
                    onClick={() => {
                      takeScreenshot();
                      setPlusOpen(false);
                    }}
                  >
                    Screenshot
                  </button>
                  <button
                    onClick={() => {
                      openCamera();
                      setPlusOpen(false);
                    }}
                  >
                    Take photo
                  </button>
                </div>
              )}
            </div>
              <div className="action-buttons">
            <button className="sbutton"><img className="chat-main-icons" src={deepsearch} alt="deepsearch" /> Deep Research</button>
            <button className="sbutton"><img className="chat-main-icons" src={imagesearch} alt="imagesearch" />Create Image</button>
            <button className="sbutton"><img className="chat-main-icons" src={websearch} alt="websearch" /> Web Search</button>
             </div>
              </div>
            <button
              className={`mic ${listening ? "listening" : ""}`}
              onClick={toggleMic}
              title="Mic"
            >
              <img className="mic-icon" src= {mic} alt="mic" />
            </button>
          </div>
        </div>

        {/* Uploaded file previews (center as small chat items) */}
        <div className="preview-area">
          {uploaded.map((f) => (
            <div className="file-preview" key={f.id}>
              {f.type.startsWith("image/") ? (
                <img src={f.url} alt={f.name} />
              ) : (
                <div className="file-icon">{f.name}</div>
              )}
              <div className="file-name">{f.name}</div>
              <button className="file-remove" onClick={() => removeUploaded(f.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Industries */}
        <h2 className="industry-title">Industries</h2>
        <div className="tags">
          {industries.map((tag, idx) => (
            <button
              key={idx}
              className="tag"
              onClick={() => onIndustryClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <footer className="footer">Powered by Techbrain Networks</footer>
      </main>

      {/* Camera modal */}
      {cameraOpen && (
        <div className="camera-modal">
          <div className="camera-box">
            <video ref={cameraVideoRef} autoPlay playsInline></video>
            <div className="camera-controls">
              <button onClick={captureFromCamera}>Capture</button>
              <button onClick={closeCamera}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
