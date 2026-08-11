import { FaRobot } from "react-icons/fa";

function ChatArea() {
  return (
    <div className="chat-area">

      <div className="welcome-card">

        <FaRobot className="robot-icon" />

        <h1>Hello Krishna 👋</h1>

        <p>
          Welcome to your AI Student Portal.
        </p>

        <p>
          Upload PDFs, chat with AI, and access your academic memory.
        </p>

      </div>

    </div>
  );
}

export default ChatArea;