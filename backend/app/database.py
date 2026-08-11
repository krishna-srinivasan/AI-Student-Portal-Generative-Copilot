# from sqlalchemy import create_engine
# from sqlalchemy.orm import declarative_base
# from sqlalchemy.orm import sessionmaker

# DATABASE_URL = "sqlite:///student_portal.db"

# engine = create_engine(
#     DATABASE_URL,
#     connect_args={"check_same_thread": False}
# )

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# Base = declarative_base()

# def get_db():
#     db = SessionLocal()

#     try:
#         yield db
#     finally:
#         db.close()



import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Load local environment variables if testing locally
load_dotenv()

# Get the Neon Database URL from Render, or use local SQLite as a backup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///student_portal.db")

# PostgreSQL crashes if it sees SQLite's 'check_same_thread' rule, so we separate them
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()