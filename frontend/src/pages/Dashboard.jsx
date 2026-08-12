// import { useState } from "react";

// // Layout Components
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";

// // Page Components
// import ChatPage from "./dashboard/ChatPage";
// import UploadPDFPage from "./dashboard/UploadPDFPage";
// import MemoryPage from "./dashboard/MemoryPage";
// import HistoryPage from "./dashboard/HistoryPage";
// import SettingsPage from "./dashboard/SettingsPage";
// import { useTheme } from "../context/ThemeContext";

// import "../styles/dashboard.css";

// function Dashboard() {
//   const [activeView, setActiveView] = useState("chat");
//   const [conversationId, setConversationId] = useState(null);
  
//   // NEW: State to control if the sidebar is open or closed
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const renderMainContent = () => {
//     switch (activeView) {
//       case "chat":
//         return <ChatPage conversationId={conversationId} setConversationId={setConversationId} />;
//       case "upload":
//         return <UploadPDFPage />;
//       case "memory":
//         return <MemoryPage />;
//       case "history":
//         return <HistoryPage setActiveView={setActiveView} setConversationId={setConversationId} />;
//       case "settings":
//         return <SettingsPage />;
//       default:
//         return <ChatPage conversationId={conversationId} setConversationId={setConversationId} />;
//     }
//   };

//   return (
//     <div className="dashboard-container">
      
//       {/* Pass the open state to Sidebar */}
//       <Sidebar
//         activeView={activeView}
//         setActiveView={setActiveView}
//         setConversationId={setConversationId}
//         isSidebarOpen={isSidebarOpen} 
//       />

//       <div className="main-content">
        
//         {/* Pass a toggle function to Header */}
//         <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

//         <div className="dynamic-view-area">
//           {renderMainContent()}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import { useState } from "react";

// Layout Components
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Page Components
import ChatPage from "./dashboard/ChatPage";
import UploadPDFPage from "./dashboard/UploadPDFPage";
import MemoryPage from "./dashboard/MemoryPage";
import HistoryPage from "./dashboard/HistoryPage";
import SettingsPage from "./dashboard/SettingsPage";
import { useTheme } from "../context/ThemeContext";

import "../styles/dashboard.css";

function Dashboard() {
  const [activeView, setActiveView] = useState("chat");
  const [conversationId, setConversationId] = useState(null);
  
  // State to control if the sidebar is open or closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed on mobile for a clean view

  const renderMainContent = () => {
    switch (activeView) {
      case "chat":
        return <ChatPage conversationId={conversationId} setConversationId={setConversationId} />;
      case "upload":
        return <UploadPDFPage />;
      case "memory":
        return <MemoryPage />;
      case "history":
        return <HistoryPage setActiveView={setActiveView} setConversationId={setConversationId} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <ChatPage conversationId={conversationId} setConversationId={setConversationId} />;
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Pass both the open state AND the setter function to Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        setConversationId={setConversationId}
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="main-content">
        
        {/* Pass a toggle function to Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="dynamic-view-area">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
