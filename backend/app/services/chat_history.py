from sqlalchemy.orm import Session
from app.models import ChatHistory


def save_chat(db: Session, user_id: int, question: str, answer: str):

    chat = ChatHistory(
        user_id=user_id,
        question=question,
        answer=answer
    )

    db.add(chat)
    db.commit()


def get_chat_history(db: Session, user_id: int):

    return (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.desc())
        .all()
    )