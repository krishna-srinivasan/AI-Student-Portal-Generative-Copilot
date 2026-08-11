from sqlalchemy.orm import Session

from app.models import Conversation


def create_conversation(
    db: Session,
    user_id: int,
    title: str = "New Chat"
):

    conversation = Conversation(
        user_id=user_id,
        title=title
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


def get_conversations(
    db: Session,
    user_id: int
):

    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    return conversations


def delete_conversation(
    db: Session,
    conversation_id: int
):

    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    if conversation:
        db.delete(conversation)
        db.commit()

        return True

    return False