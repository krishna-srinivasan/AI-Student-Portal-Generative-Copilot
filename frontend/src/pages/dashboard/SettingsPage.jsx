// function SettingsPage() {
//   return (
//     <div style={{ padding: "30px", color: "white" }}>
//       <h2>⚙️ Settings</h2>
//       <p>Manage your account settings.</p>
//     </div>
//   );
// }

// export default SettingsPage;

import { useState } from "react";
import api from "../../services/api"; // Adjust path if your api service is elsewhere

function SettingsPage() {
  // Pull current info from local storage
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [course, setCourse] = useState(localStorage.getItem("course") || "");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg("Saving...");

    // 1. Update local storage so the Header updates immediately
    localStorage.setItem("name", name);
    localStorage.setItem("course", course);

    // 2. Send update to your backend database
    try {
      const token = localStorage.getItem("token");
      // Note: Make sure you have a matching PUT or POST route in your FastAPI backend!
      await api.put(
        "/user/update", 
        { name, course },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMsg("✅ Settings saved successfully!");
    } catch (err) {
      console.log(err);
      // Fallback message if backend route doesn't exist yet
      setStatusMsg("✅ Saved locally (Ready for backend sync)."); 
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(""), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div style={{ padding: "40px", color: "white", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ color: "#00d4ff", marginBottom: "10px", fontSize: "2rem" }}>
        ⚙️ Settings
      </h2>
      <p style={{ color: "#9fb6d6", fontSize: "1rem", marginBottom: "30px" }}>
        Update your personal dashboard profile.
      </p>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Name Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "500" }}>Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              height: "50px",
              background: "#111a30",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              color: "white",
              padding: "0 20px",
              fontSize: "15px",
              outline: "none"
            }}
          />
        </div>

        {/* Course Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "500" }}>Course / Subject</label>
          <input 
            type="text" 
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            style={{
              height: "50px",
              background: "#111a30",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              color: "white",
              padding: "0 20px",
              fontSize: "15px",
              outline: "none"
            }}
          />
        </div>

        {/* Save Button */}
        <button 
          type="submit" 
          disabled={isSaving}
          style={{
            height: "50px",
            marginTop: "10px",
            background: "linear-gradient(135deg, #00d4ff, #5c6cff)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSaving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(0, 212, 255, 0.15)",
            transition: "0.3s"
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        {/* Success/Error Message */}
        {statusMsg && (
          <div style={{ textAlign: "center", color: "#00ffcc", marginTop: "10px", fontSize: "14px" }}>
            {statusMsg}
          </div>
        )}
      </form>
    </div>
  );
}

export default SettingsPage;