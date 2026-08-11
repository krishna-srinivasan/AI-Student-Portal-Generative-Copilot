import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

// 1. Added isSidebarOpen to the properties here
function Sidebar({ activeView, setActiveView, setConversationId, isSidebarOpen }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // Fetch the chat history when the sidebar loads
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/conversation/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Handle both array responses or { conversations: [...] } object structures
          setHistory(Array.isArray(data) ? data : data.conversations || []);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };

    fetchHistory();
  }, [activeView]); // Re-run if the view changes (e.g., after starting a new chat)

  const handleNewChat = () => {
    setConversationId(null); // Clear active conversation
    setActiveView("chat");   // Switch to chat page
  };

  const handleSelectChat = (id) => {
    setConversationId(id);   // Set the active conversation ID
    setActiveView("chat");   // Switch to chat page
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    // 2. Updated this div to use the isSidebarOpen state to add the "collapsed" class
    <div className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
      
      <h2 className="logo">🤖 AI Portal</h2>

      <button className="new-chat-btn" onClick={handleNewChat}>
        + New Chat
      </button>

      {/* Dynamic Chat History Section */}
      {history.length > 0 && (
        <div className="history-list" style={{ marginTop: "15px", marginBottom: "15px", maxHeight: "150px", overflowY: "auto" }}>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "5px", paddingLeft: "10px", textTransform: "uppercase" }}>
            Recent Sessions
          </div>
          
          {history.map((chat) => (
            <div
              key={chat.id}
              className="menu-item"
              style={{ fontSize: "13px", padding: "8px 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              onClick={() => handleSelectChat(chat.id)}
            >
              💬 {chat.title || "Study Session"}
            </div>
          ))}
        </div>
      )}

      {/* Main Menu Links */}
      <div className={`menu-item ${activeView === "chat" ? "active" : ""}`} onClick={() => setActiveView("chat")}>
        💬 Chat
      </div>

      <div className={`menu-item ${activeView === "upload" ? "active" : ""}`} onClick={() => setActiveView("upload")}>
        📄 Upload PDF
      </div>

      <div className={`menu-item ${activeView === "memory" ? "active" : ""}`} onClick={() => setActiveView("memory")}>
        🧠 Memory
      </div>

      <div className={`menu-item ${activeView === "history" ? "active" : ""}`} onClick={() => setActiveView("history")}>
        🕘 History
      </div>

      <div className={`menu-item ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>
        ⚙️ Settings
      </div>

      <div className="menu-item" onClick={() => navigate('/dashboard/jarvis')}>
        <span>🎙️ Voice Assistant</span>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;
