from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Conversation, ChatHistory
from app.services.conversation_service import get_conversations

router = APIRouter(
    prefix="/conversation",
    tags=["Conversation"]
)


@router.get("/list")
def conversation_list(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    return get_conversations(
        db,
        db_user.id
    )


@router.get("/{conversation_id}")
def get_conversation_messages(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == db_user.id
        )
        .first()
    )

    if conversation is None:
        return []

    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.conversation_id == conversation_id)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )

    return chats


@router.delete("/{conversation_id}")
def delete_chat(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == db_user.id
        )
        .first()
    )

    if conversation is None:
        return {
            "message": "Conversation not found"
        }

    db.delete(conversation)
    db.commit()

    return {
        "message": "Conversation deleted"
    }