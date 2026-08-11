// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ironManBg from "../../assets/images/iron-man-jarvis.jpg";

// export default function JarvisPage() {
//   const [status, setStatus] = useState("SYSTEM STANDBY...");
//   const [time, setTime] = useState(new Date());
//   const rec = useRef(null);
//   const navigate = useNavigate();

//   // Clock tick
//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Voice Setup
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

//     // Grab the username from localStorage (defaults to "Boss" if no one is logged in)
//     const currentUserName = localStorage.getItem("username") || "Boss";

//     // --- 1. DYNAMIC GREETING ---
//     if (text === "hi" || text === "hello" || text.includes("hi jarvis") || text.includes("hello jarvis")) {
//       setStatus("GREETING DETECTED");
//       speak(`Hello, ${currentUserName}. You are my boss, and all systems are online. I am ready to assist with your education and studies today. What shall we work on?`);
//       return;
//     }

//     // --- 2. CREATOR / DEVELOPER EASTER EGG ---
//     if (text.includes("who is your developer") || text.includes("who is your boss") || text.includes("who created you")) {
//       setStatus("IDENTITY QUERY");
//       speak("Krishna is my boss and my developer. He is currently studying in his final year of M.C.A. in Generative A.I. at S.R.M. University.");
//       return;
//     }

//     // --- 3. MUSIC & VIDEO PLATFORMS ---
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

//     // --- 4. DESKTOP APPS ---
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

//     // --- 5. WEBSITES ---
//     if (text.includes("open")) {
//       let site = text.split("open")[1].trim().replace(/(please|for me|\.)/g, "").trim();
//       let domain = site.replace(/\s+/g, "");
//       if (domain) {
//         speak(`Opening website ${site}.`);
//         window.open(`https://www.${domain}.com`, "_blank");
//       }
//       return;
//     }

//     // --- 6. REACT ROUTER NAVIGATION ---
//     if (text.includes("memory") || text.includes("settings") || text.includes("history") || text.includes("chat")) {
//       const route = text.match(/(memory|settings|history|chat)/)[0];
//       speak(`Accessing ${route} panel.`);
//       navigate(`/dashboard/${route}`);
//       return;
//     }

//    // --- 7. FALLBACK (GENERAL QUESTIONS TO GEMINI AI) ---
//     setStatus("CONSULTING AI CORE...");
    
//     try {
//       // Ask your Python Gemini backend
//       const response = await fetch("http://localhost:8000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: text })
//       });
      
//       const data = await response.json();
      
//       if (data.answer) {
//         setStatus("AI RESPONSE RECEIVED");
//         speak(data.answer); // J.A.R.V.I.S. speaks the Gemini response!
//       } else {
//         speak("I am sorry Sir, I could not generate a response.");
//       }
      
//     } catch (error) {
//       // If the Python server is off, it falls back to a Google Search automatically
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
//       backgroundColor: "rgba(5, 9, 20, 0.85)", 
//       minHeight: "100vh",
//       color: "#00d4ff",
//       fontFamily: "'Courier New', Courier, monospace",
//       padding: "20px",
//       overflow: "hidden",
//       boxSizing: "border-box"
//     }}>
//       {/* CSS Animations */}
//       <style>
//         {`
//           @keyframes spin { 100% { transform: rotate(360deg); } }
//           @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
//           @keyframes pulse { 0% { box-shadow: 0 0 10px #00d4ff; } 50% { box-shadow: 0 0 40px #00d4ff, 0 0 80px #00d4ff; } 100% { box-shadow: 0 0 10px #00d4ff; } }
//           @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
//           .hud-box { border: 1px solid rgba(0, 212, 255, 0.3); background: rgba(0, 20, 40, 0.4); box-shadow: inset 0 0 15px rgba(0,212,255,0.1); padding: 15px; position: relative; overflow: hidden; backdrop-filter: blur(2px); }
//           .hud-box::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #00d4ff; box-shadow: 0 0 10px #00d4ff; }
//           .hud-btn { background: transparent; border: 1px solid #00d4ff; color: #00d4ff; padding: 8px 15px; cursor: pointer; text-transform: uppercase; font-weight: bold; transition: 0.3s; width: 100%; margin-bottom: 8px; text-align: left; position: relative; }
//           .hud-btn:hover { background: rgba(0, 212, 255, 0.2); box-shadow: 0 0 10px #00d4ff; padding-left: 25px; }
//           .hud-btn:hover::before { content: '>'; position: absolute; left: 10px; }
//         `}
//       </style>

//       {/* TOP HEADER */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <div 
//             onClick={() => navigate("/dashboard")} 
//             style={{ color: "#fff", cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", textShadow: "0 0 5px #fff", display: "flex", alignItems: "center", marginBottom: "10px" }}
//           >
//             <span style={{ marginRight: "10px", fontSize: "1.5rem" }}>⟪</span> BRIDGE CONTROL
//           </div>
//           <div style={{ fontSize: "0.8rem", color: "rgba(0,212,255,0.7)" }}>S.H.I.E.L.D. OS // PROTOCOL ACTIVE</div>
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div style={{ fontSize: "3rem", fontWeight: "bold", textShadow: "0 0 15px #00d4ff", lineHeight: "1" }}>
//             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//           </div>
//           <div style={{ fontSize: "1rem", color: "#fff", marginTop: "5px" }}>
//             {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
//           </div>
//         </div>
//       </div>

//       {/* MAIN HUD GRID */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "20px", height: "70vh" }}>
        
//         {/* LEFT PANEL - QUICK COMMANDS */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//           <div className="hud-box">
//             <h4 style={{ margin: "0 0 15px 0", borderBottom: "1px solid rgba(0,212,255,0.3)", paddingBottom: "5px" }}>SYSTEM LOAD</h4>
//             <div style={{ fontSize: "0.8rem", marginBottom: "10px" }}>CPU <span style={{ float: "right" }}>31%</span><div style={{ height: "4px", background: "#00d4ff", width: "31%", marginTop: "2px" }}/></div>
//             <div style={{ fontSize: "0.8rem", marginBottom: "10px" }}>RAM <span style={{ float: "right" }}>50%</span><div style={{ height: "4px", background: "#00d4ff", width: "50%", marginTop: "2px" }}/></div>
//             <div style={{ fontSize: "0.8rem" }}>SWAP <span style={{ float: "right" }}>12%</span><div style={{ height: "4px", background: "#00d4ff", width: "12%", marginTop: "2px" }}/></div>
//           </div>

//           <div className="hud-box" style={{ flexGrow: 1 }}>
//             <h4 style={{ margin: "0 0 15px 0", borderBottom: "1px solid rgba(0,212,255,0.3)", paddingBottom: "5px" }}>DESKTOP LINK</h4>
//             <button className="hud-btn" onClick={() => process("open code")}>VS Code</button>
//             <button className="hud-btn" onClick={() => process("open whatsapp")}>WhatsApp</button>
//             <button className="hud-btn" onClick={() => process("open terminal")}>Terminal</button>
//             <button className="hud-btn" onClick={() => process("open notepad")}>Notepad</button>
//           </div>
//         </div>

//         {/* CENTER PANEL - THE CORE */}
//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          
//           {/* Glowing Radar Rings */}
//           <div style={{ position: "relative", width: "350px", height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             {/* Outer Ring */}
//             <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px dashed rgba(0, 212, 255, 0.5)", borderRadius: "50%", animation: "spin 20s linear infinite", pointerEvents: "none" }} />
//             {/* Middle Ring */}
//             <div style={{ position: "absolute", width: "80%", height: "80%", border: "4px solid rgba(0, 212, 255, 0.2)", borderTop: "4px solid #00d4ff", borderBottom: "4px solid #00d4ff", borderRadius: "50%", animation: "spinReverse 15s linear infinite", pointerEvents: "none" }} />
//             {/* Inner Core */}
//             <div 
//               onClick={start}
//               style={{ 
//                 position: "relative",
//                 zIndex: 10,
//                 width: "50%", height: "50%", 
//                 background: isListening ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 20, 40, 0.8)", 
//                 border: "2px solid #00d4ff", 
//                 borderRadius: "50%", 
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
//                 animation: isListening ? "pulse 1.5s infinite" : "none",
//                 transition: "0.3s"
//               }}
//             >
//               <div style={{ textAlign: "center" }}>
//                 <div style={{ fontSize: "2rem", fontWeight: "bold" }}>J.A.R.V.I.S.</div>
//                 <div style={{ fontSize: "0.7rem", marginTop: "5px", color: isListening ? "#fff" : "rgba(0,212,255,0.7)" }}>
//                   {isListening ? "TRANSMITTING..." : "TAP TO INIT"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Status Text Box */}
//           <div style={{ marginTop: "40px", width: "80%", textAlign: "center", borderTop: "1px solid #00d4ff", borderBottom: "1px solid #00d4ff", padding: "10px", background: "rgba(0, 212, 255, 0.05)" }}>
//             <span style={{ color: "#fff", fontWeight: "bold", letterSpacing: "2px" }}>STATUS //</span> {status}
//           </div>
//         </div>

//         {/* RIGHT PANEL - NETWORK & WEBSITES */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
//           <div className="hud-box">
//              <h4 style={{ margin: "0 0 15px 0", borderBottom: "1px solid rgba(0,212,255,0.3)", paddingBottom: "5px" }}>GLOBAL NET</h4>
//              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//                <button className="hud-btn" onClick={() => process("open youtube")} style={{ fontSize: "0.7rem" }}>YouTube</button>
//                <button className="hud-btn" onClick={() => process("open github")} style={{ fontSize: "0.7rem" }}>GitHub</button>
//                <button className="hud-btn" onClick={() => process("open spotify")} style={{ fontSize: "0.7rem" }}>Spotify</button>
//                <button className="hud-btn" onClick={() => process("open chatgpt")} style={{ fontSize: "0.7rem" }}>ChatGPT</button>
//              </div>
//           </div>

//           <div className="hud-box" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//             <h4 style={{ margin: "0 0 15px 0", borderBottom: "1px solid rgba(0,212,255,0.3)", paddingBottom: "5px" }}>TARGETING</h4>
//             <div style={{ flexGrow: 1, position: "relative", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                {/* Mini Radar */}
//                <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "1px solid #00d4ff", position: "relative", overflow: "hidden" }}>
//                   <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: "rgba(0,212,255,0.5)" }} />
//                   <div style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: "1px", background: "rgba(0,212,255,0.5)" }} />
//                   {/* Radar Sweeper */}
//                   <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: "linear-gradient(to right, rgba(0,212,255,0.5) 0%, transparent 100%)", transformOrigin: "top left", animation: "spin 4s linear infinite" }} />
//                </div>
//             </div>
//             <div style={{ fontSize: "0.7rem", marginTop: "10px", textAlign: "center" }}>LATITUDE: 28.6139° N <br/> LONGITUDE: 77.2090° E</div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ironManBg from "../../assets/images/iron-man-jarvis.jpg";
// import { useTheme } from "../../context/ThemeContext"; // <-- IMPORTANT: Adjust this path to match your folder structure!

// export default function JarvisPage() {
//   const [status, setStatus] = useState("SYSTEM STANDBY...");
//   const [time, setTime] = useState(new Date());
  
//   // --- GRAB THE GLOBAL THEME STATE ---
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
//       overflow: "hidden",
//       boxSizing: "border-box",
//       transition: "all 0.5s ease"
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
//         `}
//       </style>

//       {/* TOP HEADER */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <div onClick={() => navigate("/dashboard")} style={{ color: theme.textMain, cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", textShadow: `0 0 5px ${theme.textMain}`, display: "flex", alignItems: "center", marginBottom: "10px" }}>
//             <span style={{ marginRight: "10px", fontSize: "1.5rem" }}>⟪</span> BRIDGE CONTROL
//           </div>
//           <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>S.H.I.E.L.D. OS // PROTOCOL ACTIVE</div>
          
//           {/* THE GLOBAL THEMES TOGGLE BUTTON */}
//           <button 
//             onClick={toggleTheme} // <--- Calls the global toggle function!
//             style={{ 
//               marginTop: "15px", padding: "5px 15px", background: "transparent", 
//               border: `1px solid ${theme.accent}`, color: theme.textMain, 
//               cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold", 
//               width: "180px", textAlign: "left", transition: "0.3s"
//             }}
//           >
//             ⚙ APPEARANCE: THEMES
//           </button>
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div style={{ fontSize: "3rem", fontWeight: "bold", textShadow: `0 0 15px ${theme.accent}`, lineHeight: "1", color: theme.accent }}>
//             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//           </div>
//           <div style={{ fontSize: "1rem", color: theme.textMain, marginTop: "5px" }}>
//             {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
//           </div>
//         </div>
//       </div>

//       {/* MAIN HUD GRID */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "20px", height: "70vh" }}>
        
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

//         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
//             <div style={{ flexGrow: 1, position: "relative", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
    let text = cmd.toLowerCase().trim();
    const currentUserName = localStorage.getItem("username") || "Boss";

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
      speak(`Launching desktop application: ${matchedApp}.`);
      try {
        await fetch("http://localhost:8000/open-desktop", {
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
      let site = text.split("open")[1].trim().replace(/(please|for me|\.)/g, "").trim();
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

    setStatus("CONSULTING AI CORE...");
    try {
      const response = await fetch("http://localhost:8000/ask", {
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
      overflowY: "auto" /* Added to ensure scrolling works on mobile */
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
              grid-template-columns: 1fr; /* Stacks the 3 columns into 1 */
              height: auto;
              gap: 40px;
              padding-bottom: 40px;
            }
            .jarvis-core-container {
              order: -1; /* Pushes the Jarvis circle to the top of the mobile screen */
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