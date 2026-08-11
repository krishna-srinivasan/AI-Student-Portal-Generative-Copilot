import { useEffect, useState } from "react";
import api from "../../services/api";

function HistoryPage({
    setActiveView,
    setConversationId
}) {

    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(
                "/conversation/list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setConversations(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteConversation(id) {
        try {
            const token = localStorage.getItem("token");
            await api.delete(
                `/conversation/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            loadHistory();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div
            className="history-container"
            style={{
                flex: 1,
                height: "100%",
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
                padding: "30px",
                color: "white"
            }}
        >
            <h2
                style={{
                    marginBottom: "25px",
                    color: "#00d4ff"
                }}
            >
                🕘 Conversation History
            </h2>

            {
                conversations.length === 0 ? (
                    <p>No conversations found.</p>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            onClick={() => {
                                setConversationId(conversation.id);
                                setActiveView("chat");
                            }}
                            style={{
                                background: "#141b2d",
                                padding: "18px",
                                borderRadius: "12px",
                                marginBottom: "15px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer"
                            }}
                        >
                            <div>
                                <h3>{conversation.title}</h3>
                                <small>
                                    {(() => {
                                        if (!conversation.created_at) return "";
                                        
                                        // Append 'Z' to treat naive string as UTC if offset is missing
                                        const dateStr = conversation.created_at.endsWith("Z") || conversation.created_at.includes("+")
                                            ? conversation.created_at
                                            : conversation.created_at + "Z";

                                        return new Date(dateStr).toLocaleString("en-IN", {
                                            timeZone: "Asia/Kolkata",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        });
                                    })()}
                                </small>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteConversation(conversation.id);
                                }}
                                style={{
                                    background: "#ff4d4d",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 18px",
                                    borderRadius: "8px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )
            }
        </div>
    );
}

export default HistoryPage;