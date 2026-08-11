# import os
# import shutil
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# # Note: Adjust the import below based on the actual name of your auth dependency
# from app.dependencies import get_current_user 
# from app.services.pdf_service import process_and_index_pdf
# from pydantic import BaseModel

# router = APIRouter(
#     prefix="/upload",
#     tags=["Upload"]
# )

# # Ensure the uploads directory exists
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

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

#     return {
#         "message": "PDF uploaded and saved to AI memory successfully!", 
#         "filename": file.filename,
#         "path": file_path
#     }


# # Keep a temporary list in memory (or connect this to your database model)
# UPLOADED_DOCS_DB = []

# @router.post("/upload/pdf")
# async def upload_pdf(file: UploadFile = File(...)):
#     # Your existing PDF processing and FAISS indexing logic here...
    
#     # Save file metadata so MemoryPage can find it
#     UPLOADED_DOCS_DB.append({
#         "id": len(UPLOADED_DOCS_DB) + 1,
#         "filename": file.filename,
#         "uploadDate": "2026-07-26" # Or use datetime.now().strftime("%Y-%m-%d")
#     })
    
#     return {"message": "Uploaded successfully"}

# @router.get("/documents") # or /upload/documents depending on your prefix
# async def get_docs():
#     return {"documents": UPLOADED_DOCS_DB}

# @router.delete("/documents/{doc_id}")
# async def del_doc(doc_id: int):
#     global UPLOADED_DOCS_DB
#     UPLOADED_DOCS_DB = [doc for doc in UPLOADED_DOCS_DB if doc["id"] != doc_id]
#     return {"message": "Deleted"}


import os
import shutil
from datetime import date
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# Note: Adjust the import below based on the actual name of your auth dependency
from app.dependencies import get_current_user 
from app.services.pdf_service import process_and_index_pdf

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# Ensure the uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Keep a temporary list in memory to store uploaded documents
UPLOADED_DOCS_DB = []

@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user) # Secures the route with JWT
):
    # 1. Validate the file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # 2. Define the secure file path
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # 3. Save the uploaded file to the backend/uploads directory
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # 4. Extract text and save to FAISS Vector DB
    try:
        process_and_index_pdf(file_path, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract and index PDF text: {str(e)}")

    # 5. Save file metadata so MemoryPage can find it
    UPLOADED_DOCS_DB.append({
        "id": len(UPLOADED_DOCS_DB) + 1,
        "filename": file.filename,
        "uploadDate": str(date.today())
    })

    return {
        "message": "PDF uploaded and saved to AI memory successfully!", 
        "filename": file.filename,
        "path": file_path
    }

@router.get("/documents")
async def get_docs():
    return {"documents": UPLOADED_DOCS_DB}

@router.delete("/documents/{doc_id}")
async def del_doc(doc_id: int):
    global UPLOADED_DOCS_DB
    UPLOADED_DOCS_DB = [doc for doc in UPLOADED_DOCS_DB if doc["id"] != doc_id]
    return {"message": "Deleted successfully"}