from fastapi import FastAPI

from app.database import Base, engine
from app.routers.chat import router as chat_router
from app.routers.auth import router as auth_router



Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Student Portal",
    version="1.0"
)

app.include_router(chat_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "status": "Running",
        "project": "AI Student Portal"
    }