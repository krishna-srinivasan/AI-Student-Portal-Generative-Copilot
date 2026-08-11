from sqlalchemy.orm import Session
from app.models import ChatHistory


def save_chat(db: Session, conversation_id: int, question: str, answer: str):

    chat = ChatHistory(
        conversation_id=conversation_id,
        question=question,
        answer=answer
    )

    db.add(chat)
    db.commit()


def get_chat_history(db: Session, conversation_id: int):

    return (
        db.query(ChatHistory)
        .filter(ChatHistory.conversation_id == conversation_id)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )