from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.services.chatbot import ask_gemini
from app.services.chat_history import save_chat, get_chat_history
from app.memory.memory_service import save_memory
from app.chat_schema import ChatHistoryResponse

router = APIRouter(tags=["Chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    reply = ask_gemini(request.message)

    save_chat(
        db=db,
        user_id=db_user.id,
        question=request.message,
        answer=reply
    )

    save_memory(
        question=request.message,
        answer=reply
    )

    return {
        "user": db_user.email,
        "reply": reply
    }

@router.get(
    "/chat/history",
    response_model=list[ChatHistoryResponse]
)
def chat_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    return get_chat_history(db, db_user.id)