# from pydantic import BaseModel
# from datetime import datetime


# class ChatHistoryResponse(BaseModel):
#     question: str
#     answer: str
#     created_at: datetime

#     class Config:
#         from_attributes = True

from pydantic import BaseModel
from datetime import datetime


class ChatHistoryResponse(BaseModel):
    question: str
    answer: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True