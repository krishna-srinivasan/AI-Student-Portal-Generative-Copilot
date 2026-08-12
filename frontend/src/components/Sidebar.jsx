// import { useState, useEffect } from "react";
// import { Link, useNavigate, NavLink } from "react-router-dom";

// // 1. Added isSidebarOpen to the properties here
// function Sidebar({ activeView, setActiveView, setConversationId, isSidebarOpen }) {
//   const navigate = useNavigate();
//   const [history, setHistory] = useState([]);

//   // Fetch the chat history when the sidebar loads
//   useEffect(() => {
//     const fetchHistory = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const response = await fetch("http://127.0.0.1:8000/conversation/list", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           // Handle both array responses or { conversations: [...] } object structures
//           setHistory(Array.isArray(data) ? data : data.conversations || []);
//         }
//       } catch (error) {
//         console.error("Failed to load history:", error);
//       }
//     };

//     fetchHistory();
//   }, [activeView]); // Re-run if the view changes (e.g., after starting a new chat)

//   const handleNewChat = () => {
//     setConversationId(null); // Clear active conversation
//     setActiveView("chat");   // Switch to chat page
//   };

//   const handleSelectChat = (id) => {
//     setConversationId(id);   // Set the active conversation ID
//     setActiveView("chat");   // Switch to chat page
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     // 2. Updated this div to use the isSidebarOpen state to add the "collapsed" class
//     <div className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
      
//       <h2 className="logo">🤖 AI Portal</h2>

//       <button className="new-chat-btn" onClick={handleNewChat}>
//         + New Chat
//       </button>

//       {/* Dynamic Chat History Section */}
//       {history.length > 0 && (
//         <div className="history-list" style={{ marginTop: "15px", marginBottom: "15px", maxHeight: "150px", overflowY: "auto" }}>
//           <div style={{ fontSize: "12px", color: "#888", marginBottom: "5px", paddingLeft: "10px", textTransform: "uppercase" }}>
//             Recent Sessions
//           </div>
          
//           {history.map((chat) => (
//             <div
//               key={chat.id}
//               className="menu-item"
//               style={{ fontSize: "13px", padding: "8px 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
//               onClick={() => handleSelectChat(chat.id)}
//             >
//               💬 {chat.title || "Study Session"}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Main Menu Links */}
//       <div className={`menu-item ${activeView === "chat" ? "active" : ""}`} onClick={() => setActiveView("chat")}>
//         💬 Chat
//       </div>

//       <div className={`menu-item ${activeView === "upload" ? "active" : ""}`} onClick={() => setActiveView("upload")}>
//         📄 Upload PDF
//       </div>

//       <div className={`menu-item ${activeView === "memory" ? "active" : ""}`} onClick={() => setActiveView("memory")}>
//         🧠 Memory
//       </div>

//       <div className={`menu-item ${activeView === "history" ? "active" : ""}`} onClick={() => setActiveView("history")}>
//         🕘 History
//       </div>

//       <div className={`menu-item ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>
//         ⚙️ Settings
//       </div>

//       <div className="menu-item" onClick={() => navigate('/dashboard/jarvis')}>
//         <span>🎙️ Voice Assistant</span>
//       </div>

//       <button className="logout-btn" onClick={handleLogout}>
//         🚪 Logout
//       </button>
//     </div>
//   );
// }

// export default Sidebar;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ 
  activeView, 
  setActiveView, 
  setConversationId, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  toggleSidebar 
}) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // Fallback API URL for live production vs local testing
  const API_BASE_URL = import.meta.env?.VITE_API_URL || "https://ai-student-portal-generative-copilot.onrender.com";

  // Helper function to automatically close sidebar on mobile when a menu link is tapped
  const closeMobileSidebar = () => {
    if (setIsSidebarOpen) setIsSidebarOpen(false);
    if (toggleSidebar) toggleSidebar(false);
  };

  // Fetch the chat history when the sidebar loads
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/conversation/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHistory(Array.isArray(data) ? data : data.conversations || []);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };

    fetchHistory();
  }, [activeView]);

  const handleNewChat = () => {
    setConversationId(null); // Clear active conversation
    setActiveView("chat");   // Switch to chat page
    closeMobileSidebar();    // Hide mobile drawer
  };

  const handleSelectChat = (id) => {
    setConversationId(id);   // Set the active conversation ID
    setActiveView("chat");   // Switch to chat page
    closeMobileSidebar();    // Hide mobile drawer
  };

  const handleNavClick = (viewName) => {
    setActiveView(viewName);
    closeMobileSidebar();    // Hide mobile drawer
  };

  const handleLogout = () => {
    localStorage.clear();
    closeMobileSidebar();
    navigate("/");
  };

  return (
    <div 
      className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}
      style={{
        height: "100dvh",      // Fits perfectly inside mobile viewport bounds
        overflowY: "auto",     // Allows scrolling if menu items overflow
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000
      }}
    >
      {/* Header section with Close button for Mobile */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          paddingRight: "10px" 
        }}
      >
        <h2 className="logo">🤖 AI Portal</h2>

        {/* Mobile Close Button */}
        <button
          onClick={closeMobileSidebar}
          style={{
            background: "transparent",
            border: "none",
            color: "#ffffff",
            fontSize: "22px",
            cursor: "pointer",
            padding: "5px 10px"
          }}
          title="Close Sidebar"
        >
          ✖
        </button>
      </div>

      <button className="new-chat-btn" onClick={handleNewChat}>
        + New Chat
      </button>

      {/* Dynamic Chat History Section */}
      {history.length > 0 && (
        <div 
          className="history-list" 
          style={{ marginTop: "15px", marginBottom: "15px", maxHeight: "150px", overflowY: "auto" }}
        >
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
      <div 
        className={`menu-item ${activeView === "chat" ? "active" : ""}`} 
        onClick={() => handleNavClick("chat")}
      >
        💬 Chat
      </div>

      <div 
        className={`menu-item ${activeView === "upload" ? "active" : ""}`} 
        onClick={() => handleNavClick("upload")}
      >
        📄 Upload PDF
      </div>

      <div 
        className={`menu-item ${activeView === "memory" ? "active" : ""}`} 
        onClick={() => handleNavClick("memory")}
      >
        🧠 Memory
      </div>

      <div 
        className={`menu-item ${activeView === "history" ? "active" : ""}`} 
        onClick={() => handleNavClick("history")}
      >
        🕘 History
      </div>

      <div 
        className={`menu-item ${activeView === "settings" ? "active" : ""}`} 
        onClick={() => handleNavClick("settings")}
      >
        ⚙️ Settings
      </div>

      <div 
        className="menu-item" 
        onClick={() => {
          closeMobileSidebar();
          navigate('/dashboard/jarvis');
        }}
      >
        <span>🎙️ Voice Assistant</span>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;