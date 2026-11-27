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
import logo from '../../assets/attrallogo1.png';
import MarkdownRenderer from './MarkdownRenderer';
import { chatApi, conversationsApi, getAuthUser, logout } from '../../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Conversations and Messages
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'deep_research' | 'web_search' | 'create_image'
  const [errorBanner, setErrorBanner] = useState("");

  const [uploaded, setUploaded] = useState([]); // {id, name, url, type}
  const [username, setUsername] = useState("Guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("Aerospace");
  const [inputPlaceholder, setInputPlaceholder] = useState("Ask Aattral anything about Aerospace Industry");
  const searchInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  const [plusOpen, setPlusOpen] = useState(false);
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

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  // Load user profile & conversations from MongoDB
  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setUsername(user.name || "User");
      setIsLoggedIn(true);
      fetchConversations();
    }
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await conversationsApi.getAll();
      if (res.data?.data) {
        setConversations(res.data.data);
      }
    } catch (err) {
      console.warn("Could not load conversations from server:", err.message);
    }
  };

  // Setup Web Speech API for voice input
  useEffect(() => {
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
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
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

  async function takeScreenshot() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const image = await captureFrameFromStream(stream);
      stream.getTracks().forEach((t) => t.stop());
      addBlobAsPreview(image, "screenshot.png", "image/png");
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert("Unable to take screenshot (permission denied or unsupported).");
    }
  }

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
  }

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
    setSelectedIndustry(tag);
    setInputPlaceholder(`Ask Aattral anything about ${tag} Industry`);
    setSearchText("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  function onProfileClick(action) {
    if (action === "logout") {
      logout();
      setIsLoggedIn(false);
      setUsername("Guest");
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
      navigate("/sign-in");
    }
    if (action === "profile") {
      alert(`Logged in as: ${username}`);
    }
    if (action === "settings") {
      alert("Settings: Connected to Aattral AI & MongoDB.");
    }
  }

  // Start fresh chat
  function handleNewChat() {
    setActiveConversationId(null);
    setMessages([]);
    setSearchText("");
    setUploaded([]);
    setActiveMode('chat');
    setErrorBanner("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  // Load a conversation from history
  async function handleSelectConversation(convId) {
    try {
      setActiveConversationId(convId);
      setErrorBanner("");
      const res = await conversationsApi.getById(convId);
      if (res.data?.data) {
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
      setErrorBanner("Could not load conversation history.");
    }
  }

  // Delete a conversation
  async function handleDeleteConversation(e, convId) {
    e.stopPropagation();
    try {
      await conversationsApi.delete(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  }

  // Toggle active mode
  function toggleMode(modeName) {
    setActiveMode((prev) => (prev === modeName ? 'chat' : modeName));
  }

  // Send message handler (streaming)
  async function handleSendMessage(queryOverride) {
    const query = (queryOverride || searchText).trim();
    if (!query || isGenerating) return;

    setErrorBanner("");
    setSearchText("");
    const attachmentsPayload = uploaded.map((u) => ({
      name: u.name,
      url: u.url,
      type: u.type,
    }));
    setUploaded([]);

    // Temporary optimistic user message
    const tempUserMsg = {
      _id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      mode: activeMode,
      attachments: attachmentsPayload,
      createdAt: new Date().toISOString(),
    };

    // Temporary streaming assistant message
    const tempAssistantId = `assistant-${Date.now()}`;
    const tempAssistantMsg = {
      _id: tempAssistantId,
      sender: "assistant",
      text: "",
      mode: activeMode,
      sources: [],
      suggestedQuestions: [],
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, tempUserMsg, tempAssistantMsg]);
    setIsGenerating(true);

    let accumulatedText = "";

    await chatApi.streamMessage(
      {
        prompt: query,
        conversationId: activeConversationId,
        mode: activeMode,
        industry: selectedIndustry,
        attachments: attachmentsPayload,
      },
      // onEvent
      (event) => {
        if (event.type === 'meta') {
          if (!activeConversationId) {
            setActiveConversationId(event.conversationId);
            fetchConversations();
          }
        } else if (event.type === 'sources') {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId ? { ...m, sources: event.sources } : m
            )
          );
        } else if (event.type === 'chunk') {
          accumulatedText += event.chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId
                ? { ...m, text: accumulatedText }
                : m
            )
          );
        } else if (event.type === 'done') {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId
                ? {
                    ...event.assistantMessage,
                    isStreaming: false,
                  }
                : m
            )
          );
          fetchConversations();
        }
      },
      // onDone
      () => {
        setIsGenerating(false);
      },
      // onError
      (err) => {
        console.error("Streaming error:", err);
        setIsGenerating(false);
        setErrorBanner(err.message || "Failed to receive AI response.");
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempAssistantId
              ? {
                  ...m,
                  text:
                    accumulatedText ||
                    "I encountered an error connecting to the AI service. Please verify your connection or try again.",
                  isStreaming: false,
                }
              : m
          )
        );
      }
    );
  }

  // Keyboard shortcut: Enter sends, Shift+Enter new line
  function onSearchKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // Like / Dislike feedback
  async function handleFeedback(messageId, feedbackType) {
    try {
      await chatApi.sendFeedback(messageId, feedbackType);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, feedback: feedbackType } : m
        )
      );
    } catch (err) {
      console.warn("Feedback failed:", err);
    }
  }

  // Copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Answer copied to clipboard!");
  }

  // Text to Speech
  function speakAnswer(text) {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`~\[\]]/g, '');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  }

  // Regenerate last response
  function handleRegenerate() {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  }

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
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
          /* OPEN STATE */
          <div className="sidebar-open-content">
            <div className="sidebar-open-top">
              <button
                className="sidebar-rail-btn"
                onClick={toggleSidebar}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.2" y="1.2" width="22.6" height="17.6" rx="4.8" stroke="#192a56" strokeWidth="2.2" />
                  <path d="M1.2 5.5C1.2 3.1 3.1 1.2 5.5 1.2H8.5V18.8H5.5C3.1 18.8 1.2 16.9 1.2 14.5V5.5Z" fill="#192a56" />
                </svg>
              </button>

              <button
                className="sidebar-search-btn"
                onClick={() => searchInputRef.current?.focus()}
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
                onClick={handleNewChat}
              >
                <svg className="action-icon-svg" width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.2" y="1.2" width="19.6" height="19.6" rx="4.5" stroke="#192a56" strokeWidth="2" />
                  <path d="M11 6V16M6 11H16" stroke="#192a56" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>New Chat</span>
              </button>

              <button
                className="sidebar-open-action-btn"
                onClick={openFilePicker}
              >
                <img className="action-icon-img" src={media} alt="Media" />
                <span>Media</span>
              </button>
            </div>

            {/* Recent Chats Section */}
            <div className="sidebar-recent-section">
              <div className="sidebar-recent-heading">Recent Chats</div>
              <div className="sidebar-recent-list" role="list">
                {conversations.length > 0 ? (
                  conversations.map((c) => (
                    <div
                      key={c._id}
                      className={`sidebar-recent-item ${activeConversationId === c._id ? "active-chat" : ""}`}
                      onClick={() => handleSelectConversation(c._id)}
                    >
                      <span className="conv-title-text">{c.title || "Conversation"}</span>
                      <button
                        className="delete-conv-btn"
                        title="Delete chat"
                        onClick={(e) => handleDeleteConversation(e, c._id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "10px", fontSize: "13px", color: "#64748b" }}>
                    No recent chats yet.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Setting & Help pill */}
            <div className="sidebar-open-bottom">
              <button
                className="sidebar-setting-help-pill"
                onClick={() => onProfileClick("settings")}
              >
                <img className="setting-pill-icon" src={settings} alt="Settings" />
                <span>Setting & Help</span>
              </button>
            </div>
          </div>
        ) : (
          /* CLOSED RAIL STATE */
          <div className="sidebar-rail-content">
            <div className="sidebar-rail-top">
              <button
                className="sidebar-rail-btn"
                onClick={toggleSidebar}
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.2" y="1.2" width="22.6" height="17.6" rx="4.8" stroke="#192a56" strokeWidth="2.2" />
                  <path d="M1.2 5.5C1.2 3.1 3.1 1.2 5.5 1.2H8.5V18.8H5.5C3.1 18.8 1.2 16.9 1.2 14.5V5.5Z" fill="#192a56" />
                </svg>
              </button>

              <button
                className="sidebar-rail-btn"
                onClick={handleNewChat}
                title="New Chat"
                aria-label="New Chat"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.2" y="1.2" width="19.6" height="19.6" rx="4.5" stroke="#192a56" strokeWidth="2" />
                  <path d="M11 6V16M6 11H16" stroke="#192a56" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <button
                className="sidebar-rail-btn"
                onClick={openFilePicker}
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
                <img className="sidebar-settings-img" src={settings} alt="Settings" />
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

        {/* Logo */}
        <div className="logo" title="Aattral" onClick={handleNewChat} style={{ cursor: "pointer" }}>
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

        {/* ========================================================
            CASE 1: ACTIVE CONVERSATION (Messages List)
            ======================================================== */}
        {messages.length > 0 ? (
          <div className="chat-active-layout">
            <div className="chat-messages-container">
              {messages.map((msg, index) => (
                <div key={msg._id || index} className={`chat-message-row ${msg.sender}`}>
                  <div className={`message-avatar ${msg.sender === "user" ? "user-av" : "assistant-av"}`}>
                    {msg.sender === "user" ? (
                      (username[0] || "U").toUpperCase()
                    ) : (
                      <img className="message-avatar-img" src={logo} alt="Aattral" />
                    )}
                  </div>

                  <div className="message-body">
                    {msg.sender === "assistant" && msg.mode && msg.mode !== "chat" && (
                      <div className={`mode-badge ${msg.mode.replace("_", "-")}`}>
                        {msg.mode.replace("_", " ")}
                      </div>
                    )}

                    <div className={`message-bubble ${msg.sender === "user" ? "user-bubble" : "assistant-bubble"}`}>
                      {msg.sender === "user" ? (
                        <div>
                          {msg.text}
                          {msg.attachments?.length > 0 && (
                            <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {msg.attachments.map((a, i) => (
                                <span key={i} style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>
                                  📎 {a.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {msg.isStreaming && !msg.text ? (
                            <div className="typing-dots">
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                            </div>
                          ) : (
                            <MarkdownRenderer content={msg.text} />
                          )}

                          {/* Web Search Sources */}
                          {msg.sources?.length > 0 && (
                            <div>
                              <div className="sources-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="2" y1="12" x2="22" y2="12"></line>
                                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                                <span>Verified Sources ({msg.sources.length})</span>
                              </div>
                              <div className="sources-list">
                                {msg.sources.map((s, sIdx) => (
                                  <a
                                    key={sIdx}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="source-card"
                                    title={s.snippet}
                                  >
                                    🌐 <span>{s.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions Toolbar */}
                          {!msg.isStreaming && msg.text && (
                            <div className="message-actions-toolbar">
                              <button
                                className="action-tool-btn"
                                onClick={() => copyToClipboard(msg.text)}
                                title="Copy answer"
                              >
                                📋 Copy
                              </button>
                              <button
                                className="action-tool-btn"
                                onClick={() => speakAnswer(msg.text)}
                                title="Listen to answer"
                              >
                                🔊 Listen
                              </button>
                              <button
                                className={`action-tool-btn ${msg.feedback === 'like' ? 'active-feedback' : ''}`}
                                onClick={() => handleFeedback(msg._id, 'like')}
                                title="Helpful"
                              >
                                👍
                              </button>
                              <button
                                className={`action-tool-btn ${msg.feedback === 'dislike' ? 'active-feedback' : ''}`}
                                onClick={() => handleFeedback(msg._id, 'dislike')}
                                title="Not helpful"
                              >
                                👎
                              </button>
                              <button
                                className="action-tool-btn"
                                onClick={handleRegenerate}
                                title="Regenerate response"
                              >
                                🔄 Regenerate
                              </button>
                            </div>
                          )}

                          {/* Suggested Follow-up Questions */}
                          {msg.suggestedQuestions?.length > 0 && !msg.isStreaming && (
                            <div className="suggested-questions-row">
                              {msg.suggestedQuestions.map((q, qIdx) => (
                                <button
                                  key={qIdx}
                                  className="suggested-pill"
                                  onClick={() => handleSendMessage(q)}
                                >
                                  ✨ {q}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Docked Search Box */}
            <div className="chat-docked-input">
              <div className="search-box">
                <input
                  ref={searchInputRef}
                  className="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={inputPlaceholder}
                  disabled={isGenerating}
                />

                <div className="input-icons">
                  <div className="plus-wrapper">
                    <button
                      className="plus-btn"
                      onClick={() => setPlusOpen((p) => !p)}
                      title="Add"
                    >
                      <img className="plus-icon" src={plus} alt="plus" />
                    </button>
                    {plusOpen && (
                      <div className="plus-menu">
                        <button
                          className="plus-menu-item"
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
                    <button
                      className={`sbutton ${activeMode === 'deep_research' ? 'active-mode' : ''}`}
                      onClick={() => toggleMode('deep_research')}
                    >
                      <img className="chat-main-icons" src={deepsearch} alt="deepsearch" /> Deep Research
                    </button>
                    <button
                      className={`sbutton ${activeMode === 'create_image' ? 'active-mode' : ''}`}
                      onClick={() => toggleMode('create_image')}
                    >
                      <img className="chat-main-icons" src={imagesearch} alt="imagesearch" /> Create Image
                    </button>
                    <button
                      className={`sbutton ${activeMode === 'web_search' ? 'active-mode' : ''}`}
                      onClick={() => toggleMode('web_search')}
                    >
                      <img className="chat-main-icons" src={websearch} alt="websearch" /> Web Search
                    </button>
                  </div>
                </div>

                {searchText.trim().length > 0 ? (
                  <button
                    className="send-active-btn"
                    onClick={() => handleSendMessage()}
                    disabled={isGenerating}
                    title="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                ) : (
                  <button
                    className={`mic ${listening ? "listening" : ""}`}
                    onClick={toggleMic}
                    title="Mic"
                  >
                    <img className="mic-icon" src={mic} alt="mic" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             CASE 2: WELCOME HOME PAGE (No Messages yet)
             ======================================================== */
          <>
            <h1 className="hello">Hello, {isLoggedIn ? username : "Guest"}</h1>

            {errorBanner && (
              <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 16px", borderRadius: "10px", margin: "10px 0", fontSize: "14px" }}>
                {errorBanner}
              </div>
            )}

            {/* Search Box */}
            <div className="search-row">
              <div className="search-box">
                <input
                  ref={searchInputRef}
                  className="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={inputPlaceholder}
                  disabled={isGenerating}
                />

                <div className="input-icons">
                  <div className="plus-wrapper">
                    <button
                      className="plus-btn"
                      onClick={() => setPlusOpen((p) => !p)}
                      title="Add"
                    >
                      <img className="plus-icon" src={plus} alt="plus" />
                    </button>
                    {plusOpen && (
                      <div className="plus-menu">
                        <button
                          className="plus-menu-item"
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
                    <button
                      className={`sbutton ${activeMode === 'deep_research' ? 'active-mode' : ''}`}
                      onClick={() => toggleMode('deep_research')}
                    >
                      <img className="chat-main-icons" src={deepsearch} alt="deepsearch" /> Deep Research
                    </button>
                    <button
                      className={`sbutton ${activeMode === 'create_image' ? 'active-mode' : ''}`}
                      onClick={() => toggleMode('create_image')}
                    >
                      <img className="chat-main-icons" src={imagesearch} alt="imagesearch" /> Create Image
                    </button>
                    <button
                      className={`sbutton ${activeMode === 'web_search' ? 'active-mode' : ''}`}
                      onClick={() => toggleMode('web_search')}
                    >
                      <img className="chat-main-icons" src={websearch} alt="websearch" /> Web Search
                    </button>
                  </div>
                </div>

                {searchText.trim().length > 0 ? (
                  <button
                    className="send-active-btn"
                    onClick={() => handleSendMessage()}
                    disabled={isGenerating}
                    title="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                ) : (
                  <button
                    className={`mic ${listening ? "listening" : ""}`}
                    onClick={toggleMic}
                    title="Mic"
                  >
                    <img className="mic-icon" src={mic} alt="mic" />
                  </button>
                )}
              </div>
            </div>

            {/* Uploaded file previews */}
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
                  className={`tag ${selectedIndustry === tag ? "active" : ""}`}
                  onClick={() => onIndustryClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <footer className="footer">Powered by Techbrain Networks</footer>
          </>
        )}
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
