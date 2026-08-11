// import { useState, useRef, useEffect } from "react";
// import api from "../services/api";

// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { FaPaperPlane, FaRobot, FaDownload } from "react-icons/fa";

// function ChatWindow({
//     conversationId,
//     setConversationId
// }) {
//     const userName = localStorage.getItem("name") || "Student";

//     const [messages, setMessages] = useState([
//         {
//             sender: "ai",
//             text: `Hello ${userName} 👋\nI'm your AI Academic Assistant.`
//         }
//     ]);

//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [historyLoading, setHistoryLoading] = useState(true);

//     const messagesEndRef = useRef(null);
//     const isNewChatJustCreated = useRef(false);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({
//             behavior: "smooth"
//         });
//     }, [messages]);

//     useEffect(() => {
//         loadHistory();
//     }, []);

//     useEffect(() => {
//         if (conversationId !== null) {
//             if (isNewChatJustCreated.current) {
//                 isNewChatJustCreated.current = false;
//             } else {
//                 loadConversation();
//             }
//         }
//     }, [conversationId]);

//     async function loadHistory() {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await api.get(
//                 "/chat/history",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             const historyMessages = [];

//             response.data.forEach(chat => {
//                 historyMessages.push({
//                     sender: "user",
//                     text: chat.question
//                 });

//                 historyMessages.push({
//                     sender: "ai",
//                     text: chat.answer
//                 });
//             });

//             if (historyMessages.length > 0) {
//                 setMessages(historyMessages);
//             }
//         }
//         catch (err) {
//             console.log(err);
//         }
//         finally {
//             setHistoryLoading(false);
//         }
//     }

//     async function loadConversation() {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await api.get(
//                 `/conversation/${conversationId}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             const chatMessages = [];

//             response.data.forEach(chat => {
//                 chatMessages.push({
//                     sender: "user",
//                     text: chat.question
//                 });

//                 chatMessages.push({
//                     sender: "ai",
//                     text: chat.answer
//                 });
//             });

//             setMessages(chatMessages);
//         }
//         catch (err) {
//             console.log(err);
//         }
//     }

//     async function sendMessage() {
//         if (!input.trim()) return;

//         const userMessage = input;

//         setMessages(prev => [
//             ...prev,
//             {
//                 sender: "user",
//                 text: userMessage
//             }
//         ]);

//         setInput("");
//         setLoading(true);

//         try {
//             const token = localStorage.getItem("token");
//             const response = await api.post(
//                 "/chat",
//                 {
//                     message: userMessage,
//                     conversation_id: conversationId
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             if (conversationId === null) {
//                 isNewChatJustCreated.current = true;
//                 setConversationId(response.data.conversation_id);
//             }

//             setMessages(prev => [
//                 ...prev,
//                 {
//                     sender: "ai",
//                     text: response.data.reply,
//                     type: response.data.type || "text",
//                     media: response.data.media || null
//                 }
//             ]);
//         }
//         catch (err) {
//             console.log(err);
//             setMessages(prev => [
//                 ...prev,
//                 {
//                     sender: "ai",
//                     text: "❌ Unable to contact AI server."
//                 }
//             ]);
//         }
//         finally {
//             setLoading(false);
//         }
//     }

//     const downloadMedia = async (url, filename) => {
//         try {
//             const response = await fetch(url);
//             const blob = await response.blob();
//             const blobUrl = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = blobUrl;
//             link.download = filename;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(blobUrl);
//         } catch (error) {
//             console.error("Download failed, opening in new tab...", error);
//             window.open(url, '_blank');
//         }
//     };

//     return (
//         <div className="chat-window">
//             <div className="messages">
//                 {historyLoading && (
//                     <div className="message ai">
//                         <FaRobot className="robot-small" />
//                         <div className="bubble">
//                             Loading previous conversations...
//                         </div>
//                     </div>
//                 )}

//                 {messages.map((msg, index) => {
//                     // --- MEDIA HYDRATION LOGIC ---
//                     let msgType = msg.type;
//                     let msgMedia = msg.media;
//                     let displayText = msg.text; // Use this to hide the secret URL

//                     if (!msgType && msg.sender === "ai") {
//                         if (displayText.includes("Here is the generated image for:")) {
//                             msgType = "image";
//                             let subject = displayText.replace("Here is the generated image for:", "").trim();
//                             if (subject.toLowerCase().startsWith("of ")) {
//                                 subject = subject.substring(3).trim();
//                             }
                            
//                             let finalPrompt = subject;
//                             if (/(creative|art|anime|painting|cartoon)/i.test(subject)) {
//                                 finalPrompt = `${subject}, highly creative, masterpiece, vibrant`;
//                             } else {
//                                 finalPrompt = `RAW candid photograph of ${subject}, 8k UHD, DSLR, shot on Sony A7R IV, highly detailed face, natural skin texture, realistic lighting, unretouched, masterpiece`;
//                             }
                            
//                             msgMedia = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=512&height=512&nologo=true&seed=${index * 100}&model=flux`;
//                         }
//                         else if (
//                             displayText.includes("Here is the generated video stream for:") || 
//                             displayText.includes("Video generation architecture is ready.") ||
//                             displayText.includes("❌ API Error") ||
//                             displayText.includes("⚠️ Search Error") ||
//                             displayText.includes("🐍 Python Error")
//                         ) {
//                             msgType = "video";
                            
//                             // THE MAGIC TRICK: Extract real URL from DB text
//                             if (displayText.includes("|||")) {
//                                 const parts = displayText.split("|||");
//                                 displayText = parts[0]; 
//                                 msgMedia = parts[1];
//                             } else {
//                                 // Fallback for very old messages
//                                 msgMedia = "https://www.w3schools.com/html/mov_bbb.mp4";
//                             }
//                         }
//                     }

//                     return (
//                         <div
//                             key={index}
//                             className={`message ${msg.sender}`}
//                         >
//                             {msg.sender === "ai" && (
//                                 <FaRobot className="robot-small" />
//                             )}

//                             <div className="bubble">
//                                 {
//                                     msg.sender === "ai" ?
//                                     (
//                                         <ReactMarkdown
//                                             remarkPlugins={[remarkGfm]}
//                                             components={{
//                                                 code({
//                                                     inline,
//                                                     className,
//                                                     children,
//                                                     ...props
//                                                 }) {
//                                                     const match = /language-(\w+)/.exec(className || "");
//                                                     const code = String(children).replace(/\n$/, "");

//                                                     if (!inline && match) {
//                                                         return (
//                                                             <div className="code-container">
//                                                                 <button
//                                                                     className="copy-btn"
//                                                                     onClick={() =>
//                                                                         navigator.clipboard.writeText(code)
//                                                                     }
//                                                                 >
//                                                                     📋 Copy
//                                                                 </button>

//                                                                 <SyntaxHighlighter
//                                                                     language={match[1]}
//                                                                     style={oneDark}
//                                                                     PreTag="div"
//                                                                     {...props}
//                                                                 >
//                                                                     {code}
//                                                                 </SyntaxHighlighter>
//                                                             </div>
//                                                         );
//                                                     }

//                                                     return (
//                                                         <code
//                                                             className={className}
//                                                             {...props}
//                                                         >
//                                                             {children}
//                                                         </code>
//                                                     );
//                                                 }
//                                             }}
//                                         >
//                                             {displayText}
//                                         </ReactMarkdown>
//                                     )
//                                     :
//                                     (
//                                         displayText
//                                     )
//                                 }
                                
//                                 {/* DYNAMIC IMAGE RENDERING */}
//                                 {msgType === "image" && (
//                                     <div style={{ marginTop: "15px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
//                                         <img 
//                                             src={msgMedia} 
//                                             alt="AI Generated" 
//                                             style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,255,255,0.3)" }} 
//                                         />
//                                         <button 
//                                             onClick={() => downloadMedia(msgMedia, "AI_Generated_Image.jpg")}
//                                             style={{
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 gap: "8px",
//                                                 padding: "8px 15px",
//                                                 backgroundColor: "#00e5ff",
//                                                 color: "#000",
//                                                 border: "none",
//                                                 borderRadius: "5px",
//                                                 cursor: "pointer",
//                                                 fontWeight: "bold",
//                                                 fontSize: "0.9rem"
//                                             }}
//                                         >
//                                             <FaDownload /> Download Image
//                                         </button>
//                                     </div>
//                                 )}

//                                 {/* DYNAMIC VIDEO RENDERING */}
//                                 {msgType === "video" && (
//                                     <div style={{ marginTop: "15px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
//                                         <video 
//                                             key={msgMedia} 
//                                             src={msgMedia}
//                                             controls 
//                                             autoPlay
//                                             muted
//                                             loop
//                                             preload="auto"
//                                             style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,255,255,0.3)", backgroundColor: "#000" }} 
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })}

//                 {loading && (
//                     <div className="message ai">
//                         <FaRobot className="robot-small" />
//                         <div className="bubble">
//                             AI is thinking...
//                         </div>
//                     </div>
//                 )}

//                 <div ref={messagesEndRef}></div>
//             </div>

//             <div className="chat-input">
//                 <input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                             sendMessage();
//                         }
//                     }}
//                     placeholder="Ask anything or type 'generate video of...'"
//                 />

//                 <button
//                     onClick={sendMessage}
//                     disabled={loading}
//                 >
//                     <FaPaperPlane />
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default ChatWindow; 






import { useState, useRef, useEffect } from "react";
import api from "../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaPaperPlane, FaRobot, FaDownload } from "react-icons/fa";

function ChatWindow({
    conversationId,
    setConversationId
}) {
    const userName = localStorage.getItem("name") || "Student";

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: `Hello ${userName} 👋\nI'm your AI Academic Assistant.`
        }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);

    const messagesEndRef = useRef(null);
    
    // NEW FLAG: Prevents the database from erasing the live video on new chats!
    const isNewChatJustCreated = useRef(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        if (conversationId !== null) {
            // FIXED RACE CONDITION: Only load from DB if it is an old chat
            if (isNewChatJustCreated.current) {
                isNewChatJustCreated.current = false; // Reset the flag
            } else {
                loadConversation();
            }
        }
    }, [conversationId]);

    async function loadHistory() {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(
                "/chat/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const historyMessages = [];

            response.data.forEach(chat => {
                historyMessages.push({
                    sender: "user",
                    text: chat.question
                });

                historyMessages.push({
                    sender: "ai",
                    text: chat.answer
                });
            });

            if (historyMessages.length > 0) {
                setMessages(historyMessages);
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setHistoryLoading(false);
        }
    }

    async function loadConversation() {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(
                `/conversation/${conversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const chatMessages = [];

            response.data.forEach(chat => {
                chatMessages.push({
                    sender: "user",
                    text: chat.question
                });

                chatMessages.push({
                    sender: "ai",
                    text: chat.answer
                });
            });

            setMessages(chatMessages);
        }
        catch (err) {
            console.log(err);
        }
    }

    async function sendMessage() {
        if (!input.trim()) return;

        const userMessage = input;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await api.post(
                "/chat",
                {
                    message: userMessage,
                    conversation_id: conversationId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (conversationId === null) {
                // SET FLAG: Tell React we just made this chat, don't overwrite it!
                isNewChatJustCreated.current = true;
                setConversationId(response.data.conversation_id);
            }

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data.reply,
                    type: response.data.type || "text",
                    media: response.data.media || null
                }
            ]);
        }
        catch (err) {
            console.log(err);
            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "❌ Unable to contact AI server."
                }
            ]);
        }
        finally {
            setLoading(false);
        }
    }

    const downloadMedia = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed, opening in new tab...", error);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {historyLoading && (
                    <div className="message ai">
                        <FaRobot className="robot-small" />
                        <div className="bubble">
                            Loading previous conversations...
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => {
                    // --- MEDIA HYDRATION LOGIC ---
                    let msgType = msg.type;
                    let msgMedia = msg.media;
                    let displayText = msg.text; // Use this to hide the secret URL

                    if (!msgType && msg.sender === "ai") {
                        // 1. Image Check
                        if (displayText.includes("Here is the generated image for:")) {
                            msgType = "image";
                            let subject = displayText.replace("Here is the generated image for:", "").trim();
                            if (subject.toLowerCase().startsWith("of ")) {
                                subject = subject.substring(3).trim();
                            }
                            
                            let finalPrompt = subject;
                            if (/(creative|art|anime|painting|cartoon)/i.test(subject)) {
                                finalPrompt = `${subject}, highly creative, masterpiece, vibrant`;
                            } else {
                                finalPrompt = `RAW candid photograph of ${subject}, 8k UHD, DSLR, shot on Sony A7R IV, highly detailed face, natural skin texture, realistic lighting, unretouched, masterpiece`;
                            }
                            
                            msgMedia = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=512&height=512&nologo=true&seed=${index * 100}&model=flux`;
                        }
                        // 2. Video Check (Pexels)
                        else if (
                            displayText.includes("Here is the generated video stream for:") || 
                            displayText.includes("Video generation architecture is ready.") ||
                            displayText.includes("❌ API Error") ||
                            displayText.includes("⚠️ Search Error") ||
                            displayText.includes("🐍 Python Error")
                        ) {
                            msgType = "video";
                            
                            if (displayText.includes("|||")) {
                                const parts = displayText.split("|||");
                                displayText = parts[0]; 
                                msgMedia = parts[1];
                            } else {
                                msgMedia = "https://www.w3schools.com/html/mov_bbb.mp4";
                            }
                        }
                        // 3. NEW: YouTube Auto-Player Check
                        else {
                            // Regex to detect a standard YouTube or youtu.be link in the AI's response
                            const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
                            const match = displayText.match(ytRegex);
                            
                            if (match && match[1]) {
                                msgType = "youtube";
                                msgMedia = match[1]; // This is the 11-character YouTube Video ID
                            }
                        }
                    }

                    return (
                        <div
                            key={index}
                            className={`message ${msg.sender}`}
                        >
                            {msg.sender === "ai" && (
                                <FaRobot className="robot-small" />
                            )}

                            <div className="bubble">
                                {
                                    msg.sender === "ai" ?
                                    (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code({
                                                    inline,
                                                    className,
                                                    children,
                                                    ...props
                                                }) {
                                                    const match = /language-(\w+)/.exec(className || "");
                                                    const code = String(children).replace(/\n$/, "");

                                                    if (!inline && match) {
                                                        return (
                                                            <div className="code-container">
                                                                <button
                                                                    className="copy-btn"
                                                                    onClick={() =>
                                                                        navigator.clipboard.writeText(code)
                                                                    }
                                                                >
                                                                    📋 Copy
                                                                </button>

                                                                <SyntaxHighlighter
                                                                    language={match[1]}
                                                                    style={oneDark}
                                                                    PreTag="div"
                                                                    {...props}
                                                                >
                                                                    {code}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <code
                                                            className={className}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {displayText}
                                        </ReactMarkdown>
                                    )
                                    :
                                    (
                                        displayText
                                    )
                                }
                                
                                {/* DYNAMIC IMAGE RENDERING */}
                                {msgType === "image" && (
                                    <div style={{ marginTop: "15px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                        <img 
                                            src={msgMedia} 
                                            alt="AI Generated" 
                                            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,255,255,0.3)" }} 
                                        />
                                        <button 
                                            onClick={() => downloadMedia(msgMedia, "AI_Generated_Image.jpg")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "8px 15px",
                                                backgroundColor: "#00e5ff",
                                                color: "#000",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            <FaDownload /> Download Image
                                        </button>
                                    </div>
                                )}

                                {/* DYNAMIC VIDEO RENDERING */}
                                {msgType === "video" && (
                                    <div style={{ marginTop: "15px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                        <video 
                                            key={msgMedia} 
                                            src={msgMedia}
                                            controls 
                                            autoPlay
                                            muted
                                            loop
                                            preload="auto"
                                            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,255,255,0.3)", backgroundColor: "#000" }} 
                                        />
                                    </div>
                                )}

                                {/* NEW: DYNAMIC YOUTUBE click to play RENDERING */}
                                {msgType === "youtube" && (
                                    <div style={{ marginTop: "15px", textAlign: "center", width: "100%" }}>
                                        <iframe 
                                            width="100%" 
                                            height="250" 
                                            // The ?autoplay=1 forces the video to start playing immediately
                                            src={`https://www.youtube.com/embed/${msgMedia}`} 
                                            title="YouTube media player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            style={{ borderRadius: "10px", boxShadow: "0 0 10px rgba(255,0,0,0.3)" }}
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="message ai">
                        <FaRobot className="robot-small" />
                        <div className="bubble">
                            AI is thinking...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}></div>
            </div>

            <div className="chat-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder="Ask anything or type 'generate video of...'"
                />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;