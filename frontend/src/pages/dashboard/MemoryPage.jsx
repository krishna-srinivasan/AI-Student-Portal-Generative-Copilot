// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// function MemoryPage() {
//   const [memories, setMemories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch uploaded PDFs/Memory when the page loads
//   useEffect(() => {
//     fetchMemories();
//   }, []);

//   const fetchMemories = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await api.get("/upload/documents", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
     
//       // Set the actual documents from the backend
//       setMemories(response.data.documents || []);
//     } catch (err) {
//       console.log("Failed to load memories:", err);
//       setMemories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Remove this document from AI memory?");
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.delete(`/upload/documents/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       // Remove from UI after successful deletion
//       setMemories(memories.filter(doc => doc.id !== id));
//     } catch (err) {
//       console.log("Failed to delete memory:", err);
//       alert("Error deleting file.");
//     }
//   };

//   return (
//     <div style={{ padding: "40px", color: "white", maxWidth: "800px", margin: "0 auto" }}>
      
//       <h2 style={{ color: "#00d4ff", marginBottom: "10px", fontSize: "2rem" }}>
//         🧠 AI Memory Base
//       </h2>
//       <p style={{ color: "#9fb6d6", fontSize: "1rem", marginBottom: "30px" }}>
//         Manage the documents and files providing context to your AI assistant.
//       </p>

//       {loading ? (
//         <div style={{ color: "#00d4ff", textAlign: "center", padding: "20px" }}>
//           Scanning memory banks...
//         </div>
//       ) : memories.length === 0 ? (
//         <div style={{ background: "#111a30", padding: "30px", borderRadius: "12px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
//           <p style={{ color: "#64748b" }}>No files in memory. Go to Upload PDF to add context.</p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//           {memories.map((doc) => (
//             <div
//               key={doc.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 background: "#121a30",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 border: "1px solid rgba(0, 255, 255, 0.1)",
//                 boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)"
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <span style={{ fontSize: "24px" }}>📄</span>
//                 <div>
//                   <h4 style={{ margin: 0, color: "#e2e8f0", fontSize: "15px" }}>{doc.filename}</h4>
//                   <span style={{ color: "#64748b", fontSize: "12px" }}>Uploaded: {doc.uploadDate}</span>
//                 </div>
//               </div>
             
//               <button
//                 onClick={() => handleDelete(doc.id)}
//                 style={{
//                   background: "rgba(255, 60, 111, 0.1)",
//                   color: "#ff3c6f",
//                   border: "1px solid rgba(255, 60, 111, 0.3)",
//                   padding: "8px 12px",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   transition: "0.2s"
//                 }}
//                 onMouseOver={(e) => {
//                   e.target.style.background = "#ff3c6f";
//                   e.target.style.color = "white";
//                 }}
//                 onMouseOut={(e) => {
//                   e.target.style.background = "rgba(255, 60, 111, 0.1)";
//                   e.target.style.color = "#ff3c6f";
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MemoryPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function MemoryPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch uploaded PDFs/Memory when the page loads
  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/upload/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
     
      // Set the actual documents from the backend
      setMemories(response.data.documents || []);
    } catch (err) {
      console.log("Failed to load memories:", err);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Remove this document from AI memory?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/upload/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI after successful deletion
      setMemories(memories.filter(doc => doc.id !== id));
    } catch (err) {
      console.log("Failed to delete memory:", err);
      alert("Error deleting file.");
    }
  };

  return (
    <div 
      style={{ 
        padding: "20px 16px", 
        color: "white", 
        maxWidth: "800px", 
        margin: "0 auto",
        width: "100%", 
        boxSizing: "border-box", 
        overflowX: "hidden" 
      }}
    >
      <h2 style={{ color: "#00d4ff", marginBottom: "10px", fontSize: "2rem" }}>
        🧠 AI Memory Base
      </h2>
      <p style={{ color: "#9fb6d6", fontSize: "1rem", marginBottom: "30px" }}>
        Manage the documents and files providing context to your AI assistant.
      </p>

      {loading ? (
        <div style={{ color: "#00d4ff", textAlign: "center", padding: "20px" }}>
          Scanning memory banks...
        </div>
      ) : memories.length === 0 ? (
        <div style={{ background: "#111a30", padding: "30px", borderRadius: "12px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <p style={{ color: "#64748b" }}>No files in memory. Go to Upload PDF to add context.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {memories.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#121a30",
                padding: "16px 12px",
                borderRadius: "12px",
                border: "1px solid rgba(0, 255, 255, 0.1)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                gap: "8px",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "24px", flexShrink: 0 }}>📄</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 
                    style={{ 
                      margin: 0, 
                      color: "#e2e8f0", 
                      fontSize: "15px", 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis" 
                    }}
                    title={doc.filename}
                  >
                    {doc.filename}
                  </h4>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>Uploaded: {doc.uploadDate}</span>
                </div>
              </div>
             
              <button
                onClick={() => handleDelete(doc.id)}
                style={{
                  flexShrink: 0,
                  background: "rgba(255, 60, 111, 0.1)",
                  color: "#ff3c6f",
                  border: "1px solid rgba(255, 60, 111, 0.3)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#ff3c6f";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(255, 60, 111, 0.1)";
                  e.target.style.color = "#ff3c6f";
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemoryPage;