# import urllib.parse
# import random
# import requests
# from typing import Optional

# from fastapi import APIRouter, Depends
# from pydantic import BaseModel
# from sqlalchemy.orm import Session

# from app.database import get_db
# from app.dependencies import get_current_user
# from app.models import User, Conversation
# from app.services.chatbot import ask_gemini
# from app.services.chat_history import save_chat, get_chat_history
# from app.memory.memory_service import save_memory, retrieve_memory
# from app.chat_schema import ChatHistoryResponse, ConversationResponse
# from app.services.rag import search_document

# router = APIRouter(tags=["Chat"])

# class ChatRequest(BaseModel):
#     message: str
#     conversation_id: Optional[int] = None

# @router.post("/chat")
# def chat(
#     request: ChatRequest,
#     current_user=Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):

#     db_user = (
#         db.query(User)
#         .filter(User.email == current_user["sub"])
#         .first()
#     )

#     conversation = None

#     if request.conversation_id:
#         conversation = (
#             db.query(Conversation)
#             .filter(
#                 Conversation.id == request.conversation_id,
#                 Conversation.user_id == db_user.id
#             )
#             .first()
#         )

#     if conversation is None:
#         conversation = Conversation(
#             user_id=db_user.id,
#             title=request.message[:40]
#         )
#         db.add(conversation)
#         db.commit()
#         db.refresh(conversation)

#     user_message_lower = request.message.strip().lower()

#     # --- 1. IMAGE GENERATION INTERCEPT ---
#     if user_message_lower.startswith("generate image"):
#         image_subject = user_message_lower.replace("generate image of", "").replace("generate image", "").strip()
        
#         if not image_subject:
#             image_subject = "a futuristic AI cityscape"
            
#         if any(word in image_subject for word in ["creative", "art", "anime", "painting", "cartoon"]):
#             final_prompt = f"{image_subject}, highly creative, masterpiece"
#         else:
#             final_prompt = f"RAW candid photograph of {image_subject}, 8k UHD, DSLR, shot on Sony A7R IV, highly detailed face, natural skin texture, realistic lighting, unretouched, masterpiece"
            
#         safe_prompt = urllib.parse.quote(final_prompt)
#         seed = random.randint(1, 100000)
        
#         image_url = f"https://image.pollinations.ai/prompt/{safe_prompt}?seed={seed}&width=512&height=512&nologo=true&model=flux"
        
#         reply = f"Here is the generated image for: {image_subject.title()}"
        
#         save_chat(
#             db=db,
#             conversation_id=conversation.id,
#             question=request.message,
#             answer=reply
#         )
        
#         return {
#             "user": db_user.email,
#             "reply": reply,
#             "media": image_url,
#             "type": "image",
#             "conversation_id": conversation.id
#         }

#     # --- 2. VIDEO GENERATION INTERCEPT (PEXELS API) ---
#     # if user_message_lower.startswith("generate video"):
#     #     video_subject = user_message_lower.replace("generate video of", "").replace("generate video", "").strip()
        
#     #     if not video_subject:
#     #         video_subject = "a cinematic race car"
            
#     #     PEXELS_API_KEY = "dwGPaRhhT3n0CSRxLDkkeEWUGmkIef6GOtQ6v9KkvyYojB2Bd18qHfeS"
        
#     #     # FIX: Pexels uses short tags. This extracts the first 1-2 words from your long sentence.
#     #     words = video_subject.split()
#     #     search_query = " ".join(words[:2]) if len(words) >= 2 else video_subject

#     #     headers = {"Authorization": PEXELS_API_KEY}
#     #     url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(search_query)}&per_page=1&orientation=landscape"
        
#     #     try:
#     #         response = requests.get(url, headers=headers)
#     #         data = response.json()
            
#     #         if data.get("videos") and len(data["videos"]) > 0:
#     #             video_url = data["videos"][0]["video_files"][0]["link"]
#     #         else:
#     #             video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
                
#     #     except Exception as e:
#     #         print("Pexels API Error:", e)
#     #         video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
        
#     #     reply = f"Here is the generated video stream for: {video_subject.title()}"
        
#     #     save_chat(
#     #         db=db,
#     #         conversation_id=conversation.id,
#     #         question=request.message,
#     #         answer=reply
#     #     )
        
#     #     return {
#     #         "user": db_user.email,
#     #         "reply": reply,
#     #         "media": video_url,
#     #         "type": "video",
#     #         "conversation_id": conversation.id
#     #     }



#     # --- 2. VIDEO GENERATION INTERCEPT (PEXELS API) ---
#     if user_message_lower.startswith("generate video"):
#         video_subject = user_message_lower.replace("generate video of", "").replace("generate video", "").strip()
        
#         if not video_subject:
#             video_subject = "motorcycle"
            
#         PEXELS_API_KEY = "dwGPaRhhT3n0CSRxLDkkeEWUGmkIef6GOtQ6v9KkvyYojB2Bd18qHfeS"
        
#         # Smat Keyword Extractor: Removes "a ", "the ", "an " and grabs the main noun
#         cleaned_subject = video_subject.replace("a ", "").replace("the ", "").replace("an ", "")
#         search_query = cleaned_subject.split()[0] if cleaned_subject else "car"

#         headers = {"Authorization": PEXELS_API_KEY}
#         url = f"https://api.pexels.com/videos/search?query={search_query}&per_page=1&orientation=landscape"
        
#         try:
#             response = requests.get(url, headers=headers)
            
#             # DIAGNOSTIC 1: Did Pexels reject the API key?
#             if response.status_code != 200:
#                 reply = f"❌ API Error {response.status_code}: Pexels rejected the request. (Did you verify your email address on Pexels?)"
#                 video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
#             else:
#                 data = response.json()
#                 # DIAGNOSTIC 2: Did Pexels find videos for the word?
#                 if data.get("videos") and len(data["videos"]) > 0:
#                     video_url = data["videos"][0]["video_files"][0]["link"]
#                     reply = f"Here is the generated video stream for: {search_query.title()}"
#                 else:
#                     reply = f"⚠️ Search Error: Pexels API worked, but found 0 videos for the specific word '{search_query}'."
#                     video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
                
#         except Exception as e:
#             # DIAGNOSTIC 3: Did Python crash? (Usually missing 'requests' library)
#             reply = f"🐍 Python Error: {str(e)}. (Try running 'pip install requests' in your terminal)."
#             video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
        
#         save_chat(
#             db=db,
#             conversation_id=conversation.id,
#             question=request.message,
#             answer=reply
#         )
        
#         return {
#             "user": db_user.email,
#             "reply": reply,
#             "media": video_url,
#             "type": "video",
#             "conversation_id": conversation.id
#         }

    

#     # --- 3. STANDARD GEMINI CHAT FLOW ---
#     memories = retrieve_memory(request.message)
#     document_results = search_document(request.message)

#     context = ""

#     if memories:
#         context += "Previous conversations:\n\n"
#         for memory in memories:
#             if isinstance(memory, dict) and "question" in memory and "answer" in memory:
#                 context += (
#                     f"Question: {memory['question']}\n"
#                     f"Answer: {memory['answer']}\n\n"
#                 )

#     if document_results:
#         context += "\nRelevant document information:\n\n"
#         for chunk in document_results:
#             context += chunk + "\n\n"

#     prompt = f"""
# You are an intelligent AI Student Portal Assistant.

# General Rules:
# - Answer clearly, accurately and professionally.
# - Use the retrieved context whenever it is relevant.
# - If the context does not contain the answer, use your own knowledge.
# - Use Markdown formatting for better readability.

# Programming Rules:
# - If the user asks for programming code or a programming solution:
#   - Return ONLY the code.
#   - Do NOT explain the code.
#   - Do NOT add comments inside the code.
#   - Do NOT add headings like "Explanation", "Output", or "Example".
#   - Format the response as a Markdown code block using the correct programming language.

# - Explain code ONLY when the user explicitly asks to explain it.

# Context:

# {context}

# User Question:

# {request.message}
# """

#     try:
#         reply = ask_gemini(prompt)
#     except Exception as e:
#         print("Gemini Error:", e)
#         reply = (
#             "⚠️ KRISH AI is currently unavailable. "
#             "Please try again in a few moments."
#         )

#     save_chat(
#         db=db,
#         conversation_id=conversation.id,
#         question=request.message,
#         answer=reply
#     )

#     save_memory(
#         question=request.message,
#         answer=reply
#     )

#     return {
#         "user": db_user.email,
#         "reply": reply,
#         "conversation_id": conversation.id
#     }

# @router.get(
#     "/chat/history",
#     response_model=list[ChatHistoryResponse]
# )
# def chat_history(
#     current_user=Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     db_user = (
#         db.query(User)
#         .filter(User.email == current_user["sub"])
#         .first()
#     )

#     return get_chat_history(db, db_user.id)

# @router.get(
#     "/conversations",
#     response_model=list[ConversationResponse]
# )
# def get_conversations(
#     current_user=Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     db_user = (
#         db.query(User)
#         .filter(User.email == current_user["sub"])
#         .first()
#     )

#     conversations = (
#         db.query(Conversation)
#         .filter(Conversation.user_id == db_user.id)
#         .order_by(Conversation.created_at.desc())
#         .all()
#     )

#     return conversations




import urllib.parse
import random
import requests
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Conversation
from app.services.chatbot import ask_gemini
from app.services.chat_history import save_chat, get_chat_history
from app.memory.memory_service import save_memory, retrieve_memory
from app.chat_schema import ChatHistoryResponse, ConversationResponse
from app.services.rag import search_document

router = APIRouter(tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

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

    conversation = None

    if request.conversation_id:
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == db_user.id
            )
            .first()
        )

    if conversation is None:
        conversation = Conversation(
            user_id=db_user.id,
            title=request.message[:40]
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    user_message_lower = request.message.strip().lower()

    # --- 1. IMAGE GENERATION INTERCEPT ---
    if user_message_lower.startswith("generate image"):
        image_subject = user_message_lower.replace("generate image of", "").replace("generate image", "").strip()
        
        if not image_subject:
            image_subject = "a futuristic AI cityscape"
            
        if any(word in image_subject for word in ["creative", "art", "anime", "painting", "cartoon"]):
            final_prompt = f"{image_subject}, highly creative, masterpiece"
        else:
            final_prompt = f"RAW candid photograph of {image_subject}, 8k UHD, DSLR, shot on Sony A7R IV, highly detailed face, natural skin texture, realistic lighting, unretouched, masterpiece"
            
        safe_prompt = urllib.parse.quote(final_prompt)
        seed = random.randint(1, 100000)
        
        image_url = f"https://image.pollinations.ai/prompt/{safe_prompt}?seed={seed}&width=512&height=512&nologo=true&model=flux"
        
        reply = f"Here is the generated image for: {image_subject.title()}"
        
        save_chat(
            db=db,
            conversation_id=conversation.id,
            question=request.message,
            answer=reply
        )
        
        return {
            "user": db_user.email,
            "reply": reply,
            "media": image_url,
            "type": "image",
            "conversation_id": conversation.id
        }

    # --- 2. VIDEO GENERATION INTERCEPT (PEXELS API) ---
    if user_message_lower.startswith("generate video"):
        video_subject = user_message_lower.replace("generate video of", "").replace("generate video", "").strip()
        
        if not video_subject:
            video_subject = "motorcycle"
            
        PEXELS_API_KEY = "dwGPaRhhT3n0CSRxLDkkeEWUGmkIef6GOtQ6v9KkvyYojB2Bd18qHfeS"
        
        # Smart Keyword Extractor: Removes "a ", "the ", "an " and grabs the main noun
        cleaned_subject = video_subject.replace("a ", "").replace("the ", "").replace("an ", "")
        search_query = cleaned_subject.split()[0] if cleaned_subject else "car"

        headers = {"Authorization": PEXELS_API_KEY}
        url = f"https://api.pexels.com/videos/search?query={search_query}&per_page=1&orientation=landscape"
        
        try:
            response = requests.get(url, headers=headers)
            
            # DIAGNOSTIC 1: Did Pexels reject the API key?
            if response.status_code != 200:
                clean_reply = f"❌ API Error {response.status_code}: Pexels rejected the request. (Did you verify your email address on Pexels?)"
                video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
            else:
                data = response.json()
                # DIAGNOSTIC 2: Did Pexels find videos for the word?
                if data.get("videos") and len(data["videos"]) > 0:
                    video_url = data["videos"][0]["video_files"][0]["link"]
                    clean_reply = f"Here is the generated video stream for: {search_query.title()}"
                else:
                    clean_reply = f"⚠️ Search Error: Pexels API worked, but found 0 videos for the specific word '{search_query}'."
                    video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
                
        except Exception as e:
            # DIAGNOSTIC 3: Did Python crash?
            clean_reply = f"🐍 Python Error: {str(e)}. (Try running 'pip install requests' in your terminal)."
            video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
        
        # THE MAGIC TRICK: Append the URL using ||| for the database
        db_reply = f"{clean_reply}|||{video_url}"
        
        save_chat(
            db=db,
            conversation_id=conversation.id,
            question=request.message,
            answer=db_reply
        )
        
        return {
            "user": db_user.email,
            "reply": clean_reply,
            "media": video_url,
            "type": "video",
            "conversation_id": conversation.id
        }

    # --- 3. STANDARD GEMINI CHAT FLOW ---
    memories = retrieve_memory(request.message)
    document_results = search_document(request.message)

    context = ""

    if memories:
        context += "Previous conversations:\n\n"
        for memory in memories:
            if isinstance(memory, dict) and "question" in memory and "answer" in memory:
                context += (
                    f"Question: {memory['question']}\n"
                    f"Answer: {memory['answer']}\n\n"
                )

    if document_results:
        context += "\nRelevant document information:\n\n"
        for chunk in document_results:
            context += chunk + "\n\n"

    prompt = f"""
You are an intelligent AI Student Portal Assistant.

General Rules:
- Answer clearly, accurately and professionally.
- Use the retrieved context whenever it is relevant.
- If the context does not contain the answer, use your own knowledge.
- Use Markdown formatting for better readability.

Programming Rules:
- If the user asks for programming code or a programming solution:
  - Return ONLY the code.
  - Do NOT explain the code.
  - Do NOT add comments inside the code.
  - Do NOT add headings like "Explanation", "Output", or "Example".
  - Format the response as a Markdown code block using the correct programming language.

- Explain code ONLY when the user explicitly asks to explain it.

Context:

{context}

User Question:

{request.message}
"""

    try:
        reply = ask_gemini(prompt)
    except Exception as e:
        print("Gemini Error:", e)
        reply = (
            "⚠️ KRISH AI is currently unavailable. "
            "Please try again in a few moments."
        )

    save_chat(
        db=db,
        conversation_id=conversation.id,
        question=request.message,
        answer=reply
    )

    save_memory(
        question=request.message,
        answer=reply
    )

    return {
        "user": db_user.email,
        "reply": reply,
        "conversation_id": conversation.id
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

@router.get(
    "/conversations",
    response_model=list[ConversationResponse]
)
def get_conversations(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == db_user.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    return conversations