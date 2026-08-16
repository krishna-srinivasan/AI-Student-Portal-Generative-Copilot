# import os
# import shutil
# from datetime import date
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# # Note: Adjust the import below based on the actual name of your auth dependency
# from app.dependencies import get_current_user 
# from app.services.pdf_service import process_and_index_pdf

# router = APIRouter(
#     prefix="/upload",
#     tags=["Upload"]
# )

# # Ensure the uploads directory exists
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # Keep a temporary list in memory to store uploaded documents
# UPLOADED_DOCS_DB = []

# @router.post("/pdf")
# async def upload_pdf(
#     file: UploadFile = File(...),
#     current_user: dict = Depends(get_current_user) # Secures the route with JWT
# ):
#     # 1. Validate the file type
#     if not file.filename.lower().endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are supported.")

#     # 2. Define the secure file path
#     file_path = os.path.join(UPLOAD_DIR, file.filename)

#     # 3. Save the uploaded file to the backend/uploads directory
#     try:
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

#     # 4. Extract text and save to FAISS Vector DB
#     try:
#         process_and_index_pdf(file_path, file.filename)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to extract and index PDF text: {str(e)}")

#     # 5. Save file metadata so MemoryPage can find it
#     UPLOADED_DOCS_DB.append({
#         "id": len(UPLOADED_DOCS_DB) + 1,
#         "filename": file.filename,
#         "uploadDate": str(date.today())
#     })

#     return {
#         "message": "PDF uploaded and saved to AI memory successfully!", 
#         "filename": file.filename,
#         "path": file_path
#     }

# @router.get("/documents")
# async def get_docs():
#     return {"documents": UPLOADED_DOCS_DB}

# @router.delete("/documents/{doc_id}")
# async def del_doc(doc_id: int):
#     global UPLOADED_DOCS_DB
#     UPLOADED_DOCS_DB = [doc for doc in UPLOADED_DOCS_DB if doc["id"] != doc_id]
#     return {"message": "Deleted successfully"}



# import os
# import shutil
# from datetime import date
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# # Note: Adjust the import below based on the actual name of your auth dependency
# from app.dependencies import get_current_user 
# from app.services.pdf_service import process_and_index_pdf

# router = APIRouter(
#     prefix="/upload",
#     tags=["Upload"]
# )

# # Ensure the uploads directory exists
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # Keep a temporary list in memory to store uploaded documents
# UPLOADED_DOCS_DB = []

# # 🛠️ THE FIX: Removed 'async'. FastAPI will now run this safely in a background thread!
# @router.post("/pdf")
# def upload_pdf(
#     file: UploadFile = File(...),
#     current_user: dict = Depends(get_current_user) # Secures the route with JWT
# ):
#     # 1. Validate the file type by extension (Bypasses mobile MIME-type bugs)
#     if not file.filename.lower().endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are supported.")

#     # 2. Define the secure file path
#     file_path = os.path.join(UPLOAD_DIR, file.filename)

#     # 3. Save the uploaded file (Now safe from blocking the server)
#     try:
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

#     # 4. Extract text and save to FAISS Vector DB
#     try:
#         process_and_index_pdf(file_path, file.filename)
#     except Exception as e:
#         # Safety measure: Clean up the broken file if indexing fails
#         if os.path.exists(file_path):
#             os.remove(file_path)
#         raise HTTPException(status_code=500, detail=f"Failed to extract and index PDF text: {str(e)}")

#     # 5. Save file metadata so MemoryPage can find it
#     UPLOADED_DOCS_DB.append({
#         "id": len(UPLOADED_DOCS_DB) + 1,
#         "filename": file.filename,
#         "uploadDate": str(date.today())
#     })

#     return {
#         "message": "PDF uploaded and saved to AI memory successfully!", 
#         "filename": file.filename,
#         "path": file_path
#     }

# @router.get("/documents")
# async def get_docs():
#     return {"documents": UPLOADED_DOCS_DB}

# @router.delete("/documents/{doc_id}")
# async def del_doc(doc_id: int):
#     global UPLOADED_DOCS_DB
#     UPLOADED_DOCS_DB = [doc for doc in UPLOADED_DOCS_DB if doc["id"] != doc_id]
#     return {"message": "Deleted successfully"}


import os
import json
import shutil
from datetime import date
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.dependencies import get_current_user 
from app.services.pdf_service import process_and_index_pdf

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "uploads"
DOCS_METADATA_FILE = "uploaded_docs.json"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_docs_metadata():
    if os.path.exists(DOCS_METADATA_FILE):
        try:
            with open(DOCS_METADATA_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_docs_metadata(docs):
    with open(DOCS_METADATA_FILE, "w") as f:
        json.dump(docs, f, indent=4)

@router.post("/pdf")
def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    try:
        process_and_index_pdf(file_path, file.filename)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to extract and index PDF text: {str(e)}")

    # Persist to JSON file on disk
    docs = load_docs_metadata()
    new_entry = {
        "id": len(docs) + 1,
        "filename": file.filename,
        "uploadDate": str(date.today())
    }
    docs.append(new_entry)
    save_docs_metadata(docs)

    return {
        "message": "PDF uploaded and saved to AI memory successfully!", 
        "filename": file.filename,
        "path": file_path
    }

@router.get("/documents")
def get_docs(current_user: dict = Depends(get_current_user)):
    docs = load_docs_metadata()
    return {"documents": docs}

@router.delete("/documents/{doc_id}")
def del_doc(doc_id: int, current_user: dict = Depends(get_current_user)):
    docs = load_docs_metadata()
    docs = [doc for doc in docs if doc.get("id") != doc_id]
    save_docs_metadata(docs)
    return {"message": "Deleted successfully"}