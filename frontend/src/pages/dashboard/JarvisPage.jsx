// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ironManBg from "../../assets/images/iron-man-jarvis.jpg";
// import { useTheme } from "../../context/ThemeContext";

// export default function JarvisPage() {
//   const [status, setStatus] = useState("SYSTEM STANDBY...");
//   const [time, setTime] = useState(new Date());
  
//   const { theme, toggleTheme, setActiveTheme } = useTheme(); 
  
//   const rec = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const updateVoices = () => window.speechSynthesis.getVoices();
//     updateVoices();
//     window.speechSynthesis.onvoiceschanged = updateVoices;
//   }, []);

//   const speak = (txt) => {
//     const u = new SpeechSynthesisUtterance(txt);
//     u.pitch = 0.5; 
//     u.rate = 0.95; 

//     const voices = window.speechSynthesis.getVoices();
//     const maleVoice = voices.find(v => 
//       v.name.toLowerCase().includes("male") || 
//       v.name.toLowerCase().includes("david") || 
//       !v.name.toLowerCase().includes("zira")
//     );
//     if (maleVoice) u.voice = maleVoice;
//     window.speechSynthesis.speak(u);
//   };

//   const process = async (cmd) => {
//     let text = cmd.toLowerCase().trim();
//     const currentUserName = localStorage.getItem("username") || "Boss";

//     if (text.includes("gold theme") || text.includes("golden theme")) {
//       setActiveTheme("gold");
//       speak("Activating golden interface, Sir.");
//       setStatus("THEME: GOLD ACTIVATED");
//       return;
//     }
//     if (text.includes("cyan theme") || text.includes("original theme") || text.includes("default theme")) {
//       setActiveTheme("cyan");
//       speak("Reverting to original cyan interface, Sir.");
//       setStatus("THEME: CYAN ACTIVATED");
//       return;
//     }

//     if (text === "hi" || text === "hello" || text.includes("hi jarvis") || text.includes("hello jarvis")) {
//       setStatus("GREETING DETECTED");
//       speak(`Hello, ${currentUserName}. You are my boss, and all systems are online. I am ready to assist with your education and studies today. What shall we work on?`);
//       return;
//     }

//     if (text.includes("who is your developer") || text.includes("who is your boss") || text.includes("who created you")) {
//       setStatus("IDENTITY QUERY");
//       speak("Krishna is my boss and my developer. He is currently studying in his final year of M.C.A. in Generative A.I. at S.R.M. University.");
//       return;
//     }

//     if (text.includes("play")) {
//       let query = text.split("play")[1].trim();
//       let platform = "youtube";
//       if (query.includes("on spotify")) { platform = "spotify"; query = query.replace("on spotify", "").trim(); } 
//       else if (query.includes("on youtube")) { platform = "youtube"; query = query.replace("on youtube", "").trim(); }
//       speak(`Right away. Opening ${query} on ${platform}.`);
//       if (platform === "spotify") window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, "_blank");
//       else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, "_blank");
//       return;
//     }

//     const desktopApps = ["notepad", "word", "excel", "calculator", "vlc", "code", "intellij", "terminal", "whatsapp"];
//     const matchedApp = desktopApps.find(app => text.includes(app));

//     if (text.includes("open") && matchedApp) {
//       speak(`Launching desktop application: ${matchedApp}.`);
//       try {
//         await fetch("http://localhost:8000/open-desktop", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ app: matchedApp })
//         });
//       } catch (err) {
//         setStatus("ERR: LOCAL BRIDGE OFFLINE.");
//         speak("Sir, my local system bridge is offline.");
//       }
//       return;
//     }

//     if (text.includes("open")) {
//       let site = text.split("open")[1].trim().replace(/(please|for me|\.)/g, "").trim();
//       let domain = site.replace(/\s+/g, "");
//       if (domain) {
//         speak(`Opening website ${site}.`);
//         window.open(`https://www.${domain}.com`, "_blank");
//       }
//       return;
//     }

//     if (text.includes("memory") || text.includes("settings") || text.includes("history") || text.includes("chat")) {
//       const route = text.match(/(memory|settings|history|chat)/)[0];
//       speak(`Accessing ${route} panel.`);
//       navigate(`/dashboard/${route}`);
//       return;
//     }

//     setStatus("CONSULTING AI CORE...");
//     try {
//       const response = await fetch("http://localhost:8000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: text })
//       });
//       const data = await response.json();
      
//       if (data.answer) {
//         setStatus("AI RESPONSE RECEIVED");
//         speak(data.answer);
//       } else {
//         speak("I am sorry Sir, I could not generate a response.");
//       }
//     } catch (error) {
//       setStatus("AI CORE OFFLINE");
//       speak("Sir, my AI core is offline. Let me search the global network for you instead.");
//       window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, "_blank");
//     }
//   };

//   const start = () => {
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SR) return alert("Voice API not supported.");
    
//     rec.current = new SR();
//     rec.current.onstart = () => setStatus("LISTENING...");
//     rec.current.onerror = (e) => setStatus(`ERR: ${e.error.toUpperCase()}`);
//     rec.current.onresult = (e) => {
//       let res = e.results[0][0].transcript;
//       setStatus(`CMD REC: "${res.toUpperCase()}"`);
//       process(res);
//     };
//     rec.current.onend = () => setTimeout(() => setStatus("SYSTEM STANDBY..."), 3000);
//     rec.current.start();
//   };

//   const isListening = status === "LISTENING...";

//   return (
//     <div style={{
//       backgroundImage: `url(${ironManBg})`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//       backgroundBlendMode: "multiply", 
//       backgroundColor: theme.bgOpacity, 
//       minHeight: "100vh",
//       color: theme.accent,
//       fontFamily: "'Courier New', Courier, monospace",
//       padding: "20px",
//       boxSizing: "border-box",
//       transition: "all 0.5s ease",
//       overflowY: "auto" /* Added to ensure scrolling works on mobile */
//     }}>
//       <style>
//         {`
//           @keyframes spin { 100% { transform: rotate(360deg); } }
//           @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
//           @keyframes pulse { 0% { box-shadow: 0 0 10px ${theme.accent}; } 50% { box-shadow: 0 0 30px ${theme.accent}, 0 0 60px ${theme.accent}; } 100% { box-shadow: 0 0 10px ${theme.accent}; } }
          
//           .hud-box { border: 1px solid ${theme.border}; background: ${theme.boxBg}; box-shadow: inset 0 0 15px ${theme.accentGlow}; padding: 15px; position: relative; overflow: hidden; backdrop-filter: blur(2px); transition: all 0.5s ease; }
//           .hud-box::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: ${theme.accent}; box-shadow: 0 0 10px ${theme.accent}; }
          
//           .hud-btn { background: transparent; border: 1px solid ${theme.accent}; color: ${theme.accent}; padding: 8px 15px; cursor: pointer; text-transform: uppercase; font-weight: bold; transition: 0.3s; width: 100%; margin-bottom: 8px; text-align: left; position: relative; }
//           .hud-btn:hover { background: ${theme.accentGlow}; box-shadow: 0 0 10px ${theme.accent}; padding-left: 25px; color: ${theme.textMain}; }
//           .hud-btn:hover::before { content: '>'; position: absolute; left: 10px; }

//           /* Layout Classes */
//           .hud-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             margin-bottom: 30px;
//           }

//           .hud-grid {
//             display: grid;
//             grid-template-columns: 1fr 2fr 1fr;
//             gap: 20px;
//             min-height: 70vh;
//           }

//           .jarvis-core-container {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             position: relative;
//           }

//           /* MOBILE RESPONSIVE MEDIA QUERY */
//           @media (max-width: 900px) {
//             .hud-header {
//               flex-direction: column;
//               align-items: center;
//               text-align: center;
//               gap: 20px;
//             }
//             .hud-header-left {
//               align-items: center !important;
//             }
//             .hud-header-right {
//               text-align: center !important;
//             }
//             .hud-grid {
//               grid-template-columns: 1fr; /* Stacks the 3 columns into 1 */
//               height: auto;
//               gap: 40px;
//               padding-bottom: 40px;
//             }
//             .jarvis-core-container {
//               order: -1; /* Pushes the Jarvis circle to the top of the mobile screen */
//               margin-top: 10px;
//               margin-bottom: 20px;
//             }
//           }
//         `}
//       </style>

//       {/* TOP HEADER */}
//       <div className="hud-header">
//         <div className="hud-header-left" style={{ display: "flex", flexDirection: "column" }}>
//           <div onClick={() => navigate("/dashboard")} style={{ color: theme.textMain, cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", textShadow: `0 0 5px ${theme.textMain}`, display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "center" }}>
//             <span style={{ marginRight: "10px", fontSize: "1.5rem" }}>⟪</span> BRIDGE CONTROL
//           </div>
//           <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>S.H.I.E.L.D. OS // PROTOCOL ACTIVE</div>
          
//           <button 
//             onClick={toggleTheme} 
//             style={{ 
//               marginTop: "15px", padding: "5px 15px", background: "transparent", 
//               border: `1px solid ${theme.accent}`, color: theme.textMain, 
//               cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", 
//               width: "180px", textAlign: "center", transition: "0.3s"
//             }}
//           >
//             ⚙ APPEARANCE: THEMES
//           </button>
//         </div>

//         <div className="hud-header-right" style={{ textAlign: "right" }}>
//           <div style={{ fontSize: "3rem", fontWeight: "bold", textShadow: `0 0 15px ${theme.accent}`, lineHeight: "1", color: theme.accent }}>
//             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//           </div>
//           <div style={{ fontSize: "1rem", color: theme.textMain, marginTop: "5px" }}>
//             {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
//           </div>
//         </div>
//       </div>

//       {/* MAIN HUD GRID */}
//       <div className="hud-grid">
        
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//           <div className="hud-box">
//             <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>SYSTEM LOAD</h4>
//             <div style={{ fontSize: "0.8rem", marginBottom: "10px", color: theme.textMain }}>CPU <span style={{ float: "right" }}>31%</span><div style={{ height: "4px", background: theme.accent, width: "31%", marginTop: "2px" }}/></div>
//             <div style={{ fontSize: "0.8rem", marginBottom: "10px", color: theme.textMain }}>RAM <span style={{ float: "right" }}>50%</span><div style={{ height: "4px", background: theme.accent, width: "50%", marginTop: "2px" }}/></div>
//             <div style={{ fontSize: "0.8rem", color: theme.textMain }}>SWAP <span style={{ float: "right" }}>12%</span><div style={{ height: "4px", background: theme.accent, width: "12%", marginTop: "2px" }}/></div>
//           </div>

//           <div className="hud-box" style={{ flexGrow: 1 }}>
//             <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>DESKTOP LINK</h4>
//             <button className="hud-btn" onClick={() => process("open code")}>VS Code</button>
//             <button className="hud-btn" onClick={() => process("open whatsapp")}>WhatsApp</button>
//             <button className="hud-btn" onClick={() => process("open terminal")}>Terminal</button>
//             <button className="hud-btn" onClick={() => process("open notepad")}>Notepad</button>
//           </div>
//         </div>

//         <div className="jarvis-core-container">
//           <div style={{ position: "relative", width: "350px", height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <div style={{ position: "absolute", width: "100%", height: "100%", border: `2px dashed ${theme.accentGlow}`, borderRadius: "50%", animation: "spin 20s linear infinite", pointerEvents: "none" }} />
//             <div style={{ position: "absolute", width: "80%", height: "80%", border: `4px solid ${theme.accentGlow}`, borderTop: `4px solid ${theme.accent}`, borderBottom: `4px solid ${theme.accent}`, borderRadius: "50%", animation: "spinReverse 15s linear infinite", pointerEvents: "none" }} />
//             <div 
//               onClick={start}
//               style={{ 
//                 position: "relative",
//                 zIndex: 10,
//                 width: "50%", height: "50%", 
//                 background: isListening ? theme.accentGlow : theme.boxBg, 
//                 border: `2px solid ${theme.accent}`, 
//                 borderRadius: "50%", 
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: `0 0 30px ${theme.accentGlow}`,
//                 animation: isListening ? "pulse 1.5s infinite" : "none",
//                 transition: "0.3s"
//               }}
//             >
//               <div style={{ textAlign: "center" }}>
//                 <div style={{ fontSize: "2rem", fontWeight: "bold", color: theme.accent }}>J.A.R.V.I.S.</div>
//                 <div style={{ fontSize: "0.7rem", marginTop: "5px", color: theme.textMain }}>
//                   {isListening ? "TRANSMITTING..." : "TAP TO INIT"}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div style={{ marginTop: "40px", width: "80%", textAlign: "center", borderTop: `1px solid ${theme.accent}`, borderBottom: `1px solid ${theme.accent}`, padding: "10px", background: theme.accentGlow, color: theme.textMain }}>
//             <span style={{ fontWeight: "bold", letterSpacing: "2px" }}>STATUS //</span> {status}
//           </div>
//         </div>

//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//           <div className="hud-box">
//              <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>GLOBAL NET</h4>
//              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//                <button className="hud-btn" onClick={() => process("open youtube")} style={{ fontSize: "0.7rem" }}>YouTube</button>
//                <button className="hud-btn" onClick={() => process("open github")} style={{ fontSize: "0.7rem" }}>GitHub</button>
//                <button className="hud-btn" onClick={() => process("open spotify")} style={{ fontSize: "0.7rem" }}>Spotify</button>
//                <button className="hud-btn" onClick={() => process("open chatgpt")} style={{ fontSize: "0.7rem" }}>ChatGPT</button>
//              </div>
//           </div>
//           <div className="hud-box" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//             <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>TARGETING</h4>
//             <div style={{ flexGrow: 1, position: "relative", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "150px" }}>
//                <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: `1px solid ${theme.accent}`, position: "relative", overflow: "hidden" }}>
//                   <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: theme.accentGlow }} />
//                   <div style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: "1px", background: theme.accentGlow }} />
//                   <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: `linear-gradient(to right, ${theme.accentGlow} 0%, transparent 100%)`, transformOrigin: "top left", animation: "spin 4s linear infinite" }} />
//                </div>
//             </div>
//             <div style={{ fontSize: "0.7rem", marginTop: "10px", textAlign: "center", color: theme.textMain }}>LATITUDE: 28.6139° N <br/> LONGITUDE: 77.2090° E</div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ironManBg from "../../assets/images/iron-man-jarvis.jpg";
import { useTheme } from "../../context/ThemeContext";

export default function JarvisPage() {
  const [status, setStatus] = useState("SYSTEM STANDBY...");
  const [time, setTime] = useState(new Date());
  
  const { theme, toggleTheme, setActiveTheme } = useTheme(); 
  
  const rec = useRef(null);
  const navigate = useNavigate();

  // The live backend URL so Jarvis works on mobile devices
  const API_BASE_URL = import.meta.env?.VITE_API_URL || "https://ai-student-portal-generative-copilot.onrender.com";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateVoices = () => window.speechSynthesis.getVoices();
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.pitch = 0.5; 
    u.rate = 0.95; 

    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes("male") || 
      v.name.toLowerCase().includes("david") || 
      !v.name.toLowerCase().includes("zira")
    );
    if (maleVoice) u.voice = maleVoice;
    window.speechSynthesis.speak(u);
  };

  const process = async (cmd) => {
    // 1. CLEAN THE TEXT: Remove periods/commas that break voice recognition
    let text = cmd.toLowerCase().trim().replace(/[.,!?]/g, "");
    const currentUserName = localStorage.getItem("name") || "Boss";

    if (text.includes("gold theme") || text.includes("golden theme")) {
      setActiveTheme("gold");
      speak("Activating golden interface, Sir.");
      setStatus("THEME: GOLD ACTIVATED");
      return;
    }
    
    if (text.includes("cyan theme") || text.includes("original theme") || text.includes("default theme")) {
      setActiveTheme("cyan");
      speak("Reverting to original cyan interface, Sir.");
      setStatus("THEME: CYAN ACTIVATED");
      return;
    }

    if (text === "hi" || text === "hello" || text.includes("hi jarvis") || text.includes("hello jarvis")) {
      setStatus("GREETING DETECTED");
      speak(`Hello, ${currentUserName}. You are my boss, and all systems are online. I am ready to assist with your education and studies today. What shall we work on?`);
      return;
    }

    if (text.includes("who is your developer") || text.includes("who is your boss") || text.includes("who created you")) {
      setStatus("IDENTITY QUERY");
      speak("Krishna is my boss and my developer. He is currently studying in his final year of M.C.A. in Generative A.I. at S.R.M. University.");
      return;
    }

    // ==========================================
    // MOBILE VOICE CALLING FEATURE (FIXED)
    // ==========================================
    if (text.startsWith("call ")) {
      let contactName = text.replace("call", "").trim();

      // ALL keys MUST be strictly lowercase to match the voice input!
      const phoneBook = {
        "amma": "+916382965810", 
        "sagila": "+916382965810",
        "vahini": "+917305923367",
        "simmu": "+917305923367",
        "preethi": "+917639593488",
        "preeti": "+917639593488",
        "preethimixi": "+917639593488",
        "appa": "+919865191170",
        "aachi": "+919976955448"
      };

      // Forgiving Search: Checks if the spoken name matches our phonebook
      let foundNumber = null;
      let confirmedName = "";

      for (let key in phoneBook) {
        if (contactName.includes(key) || key.includes(contactName)) {
          foundNumber = phoneBook[key];
          confirmedName = key;
          break;
        }
      }

      if (foundNumber) {
        setStatus(`CALLING ${confirmedName.toUpperCase()}...`);
        speak(`Right away, Sir. Initiating a secure line to ${confirmedName}.`);
        
        // Trick the browser into thinking the user physically clicked a link
        setTimeout(() => {
            const link = document.createElement("a");
            link.href = `tel:${foundNumber}`;
            link.click();
        }, 1500); 
        
      } else {
        setStatus("CONTACT NOT FOUND");
        speak(`I am sorry, Sir. I do not have a registered number for ${contactName}.`);
      }
      return;
    }

    if (text.includes("play")) {
      let query = text.split("play")[1].trim();
      let platform = "youtube";
      if (query.includes("on spotify")) { platform = "spotify"; query = query.replace("on spotify", "").trim(); } 
      else if (query.includes("on youtube")) { platform = "youtube"; query = query.replace("on youtube", "").trim(); }
      speak(`Right away. Opening ${query} on ${platform}.`);
      if (platform === "spotify") window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, "_blank");
      else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, "_blank");
      return;
    }

    const desktopApps = ["notepad", "word", "excel", "calculator", "vlc", "code", "intellij", "terminal", "whatsapp"];
    const matchedApp = desktopApps.find(app => text.includes(app));

    if (text.includes("open") && matchedApp) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      speak(`Launching ${matchedApp}.`);

      // MOBILE WHATSAPP FIX
      if (matchedApp === "whatsapp" && isMobile) {
         setStatus("LAUNCHING NATIVE APP...");
         // Using the official web API link prevents the browser from blocking it
         const link = document.createElement("a");
         link.href = "https://api.whatsapp.com/send?text="; 
         link.click();
         return;
      }

      try {
        await fetch(`${API_BASE_URL}/open-desktop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ app: matchedApp })
        });
      } catch (err) {
        setStatus("ERR: LOCAL BRIDGE OFFLINE.");
        speak("Sir, my local system bridge is offline.");
      }
      return;
    }

    if (text.includes("open")) {
      let site = text.split("open")[1].trim().replace(/(please|for me)/g, "").trim();
      let domain = site.replace(/\s+/g, "");
      if (domain) {
        speak(`Opening website ${site}.`);
        window.open(`https://www.${domain}.com`, "_blank");
      }
      return;
    }

    if (text.includes("memory") || text.includes("settings") || text.includes("history") || text.includes("chat")) {
      const route = text.match(/(memory|settings|history|chat)/)[0];
      speak(`Accessing ${route} panel.`);
      navigate(`/dashboard/${route}`);
      return;
    }

    // ==========================================
    // AI CORE FALLBACK
    // ==========================================
    setStatus("CONSULTING AI CORE...");
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });
      const data = await response.json();
      
      if (data.answer) {
        setStatus("AI RESPONSE RECEIVED");
        speak(data.answer);
      } else {
        speak("I am sorry Sir, I could not generate a response.");
      }
    } catch (error) {
      setStatus("AI CORE OFFLINE");
      speak("Sir, my AI core is offline. Let me search the global network for you instead.");
      window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice API not supported.");
    
    rec.current = new SR();
    rec.current.onstart = () => setStatus("LISTENING...");
    rec.current.onerror = (e) => setStatus(`ERR: ${e.error.toUpperCase()}`);
    rec.current.onresult = (e) => {
      let res = e.results[0][0].transcript;
      setStatus(`CMD REC: "${res.toUpperCase()}"`);
      process(res);
    };
    rec.current.onend = () => setTimeout(() => setStatus("SYSTEM STANDBY..."), 3000);
    rec.current.start();
  };

  const isListening = status === "LISTENING...";

  return (
    <div style={{
      backgroundImage: `url(${ironManBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundBlendMode: "multiply", 
      backgroundColor: theme.bgOpacity, 
      minHeight: "100vh",
      color: theme.accent,
      fontFamily: "'Courier New', Courier, monospace",
      padding: "20px",
      boxSizing: "border-box",
      transition: "all 0.5s ease",
      overflowY: "auto"
    }}>
      <style>
        {`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
          @keyframes pulse { 0% { box-shadow: 0 0 10px ${theme.accent}; } 50% { box-shadow: 0 0 30px ${theme.accent}, 0 0 60px ${theme.accent}; } 100% { box-shadow: 0 0 10px ${theme.accent}; } }
          
          .hud-box { border: 1px solid ${theme.border}; background: ${theme.boxBg}; box-shadow: inset 0 0 15px ${theme.accentGlow}; padding: 15px; position: relative; overflow: hidden; backdrop-filter: blur(2px); transition: all 0.5s ease; }
          .hud-box::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: ${theme.accent}; box-shadow: 0 0 10px ${theme.accent}; }
          
          .hud-btn { background: transparent; border: 1px solid ${theme.accent}; color: ${theme.accent}; padding: 8px 15px; cursor: pointer; text-transform: uppercase; font-weight: bold; transition: 0.3s; width: 100%; margin-bottom: 8px; text-align: left; position: relative; }
          .hud-btn:hover { background: ${theme.accentGlow}; box-shadow: 0 0 10px ${theme.accent}; padding-left: 25px; color: ${theme.textMain}; }
          .hud-btn:hover::before { content: '>'; position: absolute; left: 10px; }

          /* Layout Classes */
          .hud-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
          }

          .hud-grid {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 20px;
            min-height: 70vh;
          }

          .jarvis-core-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          /* MOBILE RESPONSIVE MEDIA QUERY */
          @media (max-width: 900px) {
            .hud-header {
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 20px;
            }
            .hud-header-left {
              align-items: center !important;
            }
            .hud-header-right {
              text-align: center !important;
            }
            .hud-grid {
              grid-template-columns: 1fr; 
              height: auto;
              gap: 40px;
              padding-bottom: 40px;
            }
            .jarvis-core-container {
              order: -1; 
              margin-top: 10px;
              margin-bottom: 20px;
            }
          }
        `}
      </style>

      {/* TOP HEADER */}
      <div className="hud-header">
        <div className="hud-header-left" style={{ display: "flex", flexDirection: "column" }}>
          <div onClick={() => navigate("/dashboard")} style={{ color: theme.textMain, cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", textShadow: `0 0 5px ${theme.textMain}`, display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "center" }}>
            <span style={{ marginRight: "10px", fontSize: "1.5rem" }}>⟪</span> BRIDGE CONTROL
          </div>
          <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>S.H.I.E.L.D. OS // PROTOCOL ACTIVE</div>
          
          <button 
            onClick={toggleTheme} 
            style={{ 
              marginTop: "15px", padding: "5px 15px", background: "transparent", 
              border: `1px solid ${theme.accent}`, color: theme.textMain, 
              cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", 
              width: "180px", textAlign: "center", transition: "0.3s"
            }}
          >
            ⚙ APPEARANCE: THEMES
          </button>
        </div>

        <div className="hud-header-right" style={{ textAlign: "right" }}>
          <div style={{ fontSize: "3rem", fontWeight: "bold", textShadow: `0 0 15px ${theme.accent}`, lineHeight: "1", color: theme.accent }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>
          <div style={{ fontSize: "1rem", color: theme.textMain, marginTop: "5px" }}>
            {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </div>

      {/* MAIN HUD GRID */}
      <div className="hud-grid">
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="hud-box">
            <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>SYSTEM LOAD</h4>
            <div style={{ fontSize: "0.8rem", marginBottom: "10px", color: theme.textMain }}>CPU <span style={{ float: "right" }}>31%</span><div style={{ height: "4px", background: theme.accent, width: "31%", marginTop: "2px" }}/></div>
            <div style={{ fontSize: "0.8rem", marginBottom: "10px", color: theme.textMain }}>RAM <span style={{ float: "right" }}>50%</span><div style={{ height: "4px", background: theme.accent, width: "50%", marginTop: "2px" }}/></div>
            <div style={{ fontSize: "0.8rem", color: theme.textMain }}>SWAP <span style={{ float: "right" }}>12%</span><div style={{ height: "4px", background: theme.accent, width: "12%", marginTop: "2px" }}/></div>
          </div>

          <div className="hud-box" style={{ flexGrow: 1 }}>
            <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>DESKTOP LINK</h4>
            <button className="hud-btn" onClick={() => process("open code")}>VS Code</button>
            <button className="hud-btn" onClick={() => process("open whatsapp")}>WhatsApp</button>
            <button className="hud-btn" onClick={() => process("open terminal")}>Terminal</button>
            <button className="hud-btn" onClick={() => process("open notepad")}>Notepad</button>
          </div>
        </div>

        <div className="jarvis-core-container">
          <div style={{ position: "relative", width: "350px", height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "100%", height: "100%", border: `2px dashed ${theme.accentGlow}`, borderRadius: "50%", animation: "spin 20s linear infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "80%", height: "80%", border: `4px solid ${theme.accentGlow}`, borderTop: `4px solid ${theme.accent}`, borderBottom: `4px solid ${theme.accent}`, borderRadius: "50%", animation: "spinReverse 15s linear infinite", pointerEvents: "none" }} />
            <div 
              onClick={start}
              style={{ 
                position: "relative",
                zIndex: 10,
                width: "50%", height: "50%", 
                background: isListening ? theme.accentGlow : theme.boxBg, 
                border: `2px solid ${theme.accent}`, 
                borderRadius: "50%", 
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: `0 0 30px ${theme.accentGlow}`,
                animation: isListening ? "pulse 1.5s infinite" : "none",
                transition: "0.3s"
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: theme.accent }}>J.A.R.V.I.S.</div>
                <div style={{ fontSize: "0.7rem", marginTop: "5px", color: theme.textMain }}>
                  {isListening ? "TRANSMITTING..." : "TAP TO INIT"}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "40px", width: "80%", textAlign: "center", borderTop: `1px solid ${theme.accent}`, borderBottom: `1px solid ${theme.accent}`, padding: "10px", background: theme.accentGlow, color: theme.textMain }}>
            <span style={{ fontWeight: "bold", letterSpacing: "2px" }}>STATUS //</span> {status}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="hud-box">
             <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>GLOBAL NET</h4>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
               <button className="hud-btn" onClick={() => process("open youtube")} style={{ fontSize: "0.7rem" }}>YouTube</button>
               <button className="hud-btn" onClick={() => process("open github")} style={{ fontSize: "0.7rem" }}>GitHub</button>
               <button className="hud-btn" onClick={() => process("open spotify")} style={{ fontSize: "0.7rem" }}>Spotify</button>
               <button className="hud-btn" onClick={() => process("open chatgpt")} style={{ fontSize: "0.7rem" }}>ChatGPT</button>
             </div>
          </div>
          <div className="hud-box" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <h4 style={{ margin: "0 0 15px 0", borderBottom: `1px solid ${theme.border}`, paddingBottom: "5px", color: theme.textMain }}>TARGETING</h4>
            <div style={{ flexGrow: 1, position: "relative", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "150px" }}>
               <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: `1px solid ${theme.accent}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: theme.accentGlow }} />
                  <div style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: "1px", background: theme.accentGlow }} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: `linear-gradient(to right, ${theme.accentGlow} 0%, transparent 100%)`, transformOrigin: "top left", animation: "spin 4s linear infinite" }} />
               </div>
            </div>
            <div style={{ fontSize: "0.7rem", marginTop: "10px", textAlign: "center", color: theme.textMain }}>LATITUDE: 28.6139° N <br/> LONGITUDE: 77.2090° E</div>
          </div>
        </div>

      </div>
    </div>
  );
}