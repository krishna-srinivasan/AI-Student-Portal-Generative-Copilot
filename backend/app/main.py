
import subprocess
import os
import platform
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

from app.database import Base, engine
from app.routers.chat import router as chat_router
from app.routers.auth import router as auth_router
from app.routers.document import router as document_router
from app.routers.conversation import router as conversation_router
from app.routers.upload import router as upload_router 

app = FastAPI(
    title="AI Student Portal",
    version="1.0"
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Configure CORS to accept requests from your React frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your project routers
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(conversation_router)
app.include_router(upload_router) 

# --- GEMINI AI SETUP ---
# Initializes the new GenAI Client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
class AskQuery(BaseModel):
    prompt: str

# @app.post("/ask")
# async def ask_jarvis(q: AskQuery):
#     try:
#         # Prompt Gemini using the new SDK syntax
#         res = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=q.prompt + " Reply in 1 or 2 short sentences."
#         )
#         # Remove markdown stars so the text-to-speech doesn't read them out loud
#         clean_text = res.text.replace("*", "").replace("#", "") 
#         return {"answer": clean_text}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_jarvis(q: AskQuery):
    try:
        # Prompt Gemini (Switched to 1.5-flash for max stability)
        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=q.prompt + " Reply in 1 or 2 short sentences."
        )
        
        # Remove markdown stars
        clean_text = res.text.replace("*", "").replace("#", "") 
        return {"answer": clean_text}
        
    except Exception as e:
        # THIS WILL PRINT THE EXACT ERROR IN YOUR TERMINAL
        print(f"\n--- GEMINI API ERROR ---")
        print(str(e))
        print(f"------------------------\n")
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------

# --- DESKTOP APP LAUNCHER ENDPOINT ---
class AppRequest(BaseModel):
    app: str

@app.post("/open-desktop")
async def open_desktop_app(req: AppRequest):
    app_name = req.app.lower()
    system = platform.system()
    
    try:
        if system == "Windows":
            if app_name == "calculator":
                subprocess.Popen("calc")
            elif app_name == "notepad":
                subprocess.Popen("notepad")
            elif app_name == "word":
                subprocess.Popen("start winword", shell=True)
            elif app_name == "excel":
                subprocess.Popen("start excel", shell=True)
            elif app_name == "code": 
                subprocess.Popen("code", shell=True)
            elif app_name == "whatsapp":
                subprocess.Popen("start whatsapp:", shell=True)
            else:
                subprocess.Popen(app_name, shell=True)
                
        elif system == "Darwin":  
            if app_name == "calculator":
                subprocess.Popen(["open", "-a", "Calculator"])
            elif app_name == "notepad":
                subprocess.Popen(["open", "-a", "TextEdit"])
            elif app_name == "code":
                subprocess.Popen(["open", "-a", "Visual Studio Code"])
            elif app_name == "whatsapp":
                subprocess.Popen(["open", "-a", "WhatsApp"])
            else:
                subprocess.Popen(["open", "-a", app_name])
                
        else:  
            subprocess.Popen(app_name, shell=True)
            
        return {"status": "success", "message": f"Successfully launched {app_name}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# -------------------------------------

# --- USER PROFILE UPDATE ENDPOINT ---
class UserUpdateModel(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

@app.put("/user/update")
async def update_user_profile(data: UserUpdateModel):
    try:
        return {
            "status": "success", 
            "message": "User profile updated successfully", 
            "updated_data": data.model_dump(exclude_unset=True) 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ------------------------------------

@app.get("/")
def home():
    return {
        "status": "Running",
        "project": "AI Student Portal"
    }


