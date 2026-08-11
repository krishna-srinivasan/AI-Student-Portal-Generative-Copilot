import ChatWindow from "../../components/ChatWindow";

function ChatPage({ conversationId, setConversationId }) {

    return (
        <ChatWindow
            conversationId={conversationId}
            setConversationId={setConversationId}
        />
    );

}

export default ChatPage;