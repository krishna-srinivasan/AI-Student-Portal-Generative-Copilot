import { useState } from "react";
import api from "../../services/api";

function UploadPDFPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    async function uploadPDF() {
        if (!file) {
            setMessage("Please select a PDF file first.");
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            setMessage("Uploading and indexing document into AI memory...");
            setIsError(false);

            const token = localStorage.getItem("token");

           await api.post(
                "/upload/pdf",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMessage("✅ PDF processed and saved to FAISS vector memory!");
            setIsError(false);
            setFile(null);
            // Reset file input element
            const inputElem = document.getElementById("pdfFileInput");
            if (inputElem) inputElem.value = "";

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to process PDF. Please check server logs.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="upload-container"
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
                    color: "#00d4ff",
                    marginBottom: "10px"
                }}
            >
                📄 Upload Study Material
            </h2>
            <p style={{ color: "#9eb3d0", marginBottom: "30px", fontSize: "14px" }}>
                Upload PDF notes and assignments to train your personal AI assistant context.
            </p>

            <div
                style={{
                    maxWidth: "650px",
                    margin: "0 auto",
                    background: "#141b2d",
                    padding: "40px",
                    borderRadius: "16px",
                    border: "2px dashed rgba(0, 212, 255, 0.4)",
                    textAlign: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                }}
            >
                <div style={{ fontSize: "50px", marginBottom: "15px" }}>📚</div>
                <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>Select PDF Document</h3>
                <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "25px" }}>
                    Only PDF files are supported for vector embedding.
                </p>

                <input
                    id="pdfFileInput"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                            setMessage("");
                            setIsError(false);
                        }
                    }}
                    style={{ display: "none" }}
                />

                <label
                    htmlFor="pdfFileInput"
                    style={{
                        display: "inline-block",
                        padding: "12px 28px",
                        background: "rgba(0, 212, 255, 0.12)",
                        color: "#00d4ff",
                        border: "1px solid #00d4ff",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "0.3s"
                    }}
                >
                    {file ? "Change Selected PDF" : "Choose PDF File"}
                </label>

                {file && (
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "12px 16px",
                            background: "#0b1120",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "inline-block",
                            maxWidth: "100%",
                            wordBreak: "break-all"
                        }}
                    >
                        <p style={{ color: "#9fb6d6", fontSize: "13px", margin: 0 }}>
                            Selected: <strong style={{ color: "#00eaff" }}>{file.name}</strong>
                        </p>
                    </div>
                )}

                <br />

                <button
                    onClick={uploadPDF}
                    disabled={loading || !file}
                    style={{
                        marginTop: "25px",
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "10px",
                        background: loading || !file
                            ? "#334155"
                            : "linear-gradient(135deg, #00d4ff, #5c6cff)",
                        color: "white",
                        cursor: loading || !file ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "15px",
                        boxShadow: loading || !file ? "none" : "0 4px 15px rgba(0, 212, 255, 0.3)",
                        transition: "0.3s"
                    }}
                >
                    {loading ? "Processing & Indexing..." : "Upload & Analyze PDF"}
                </button>

                {message && (
                    <p
                        style={{
                            marginTop: "20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: isError ? "#ff4d4d" : "#00ffaa"
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default UploadPDFPage;