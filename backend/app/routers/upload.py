# import os
# import json
# import shutil
# from datetime import date
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# from app.dependencies import get_current_user 
# from app.services.pdf_service import process_and_index_pdf

# router = APIRouter(
#     prefix="/upload",
#     tags=["Upload"]
# )

# UPLOAD_DIR = "uploads"
# DOCS_METADATA_FILE = "uploaded_docs.json"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# def load_docs_metadata():
#     if os.path.exists(DOCS_METADATA_FILE):
#         try:
#             with open(DOCS_METADATA_FILE, "r") as f:
#                 return json.load(f)
#         except Exception:
#             return []
#     return []

# def save_docs_metadata(docs):
#     with open(DOCS_METADATA_FILE, "w") as f:
#         json.dump(docs, f, indent=4)

# @router.post("/pdf")
# def upload_pdf(
#     file: UploadFile = File(...),
#     current_user: dict = Depends(get_current_user)
# ):
#     if not file.filename.lower().endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are supported.")

#     file_path = os.path.join(UPLOAD_DIR, file.filename)

#     try:
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

#     try:
#         process_and_index_pdf(file_path, file.filename)
#     except Exception as e:
#         if os.path.exists(file_path):
#             os.remove(file_path)
#         raise HTTPException(status_code=500, detail=f"Failed to extract and index PDF text: {str(e)}")

#     # Persist to JSON file on disk
#     docs = load_docs_metadata()
#     new_entry = {
#         "id": len(docs) + 1,
#         "filename": file.filename,
#         "uploadDate": str(date.today())
#     }
#     docs.append(new_entry)
#     save_docs_metadata(docs)

#     return {
#         "message": "PDF uploaded and saved to AI memory successfully!", 
#         "filename": file.filename,
#         "path": file_path
#     }

# @router.get("/documents")
# def get_docs(current_user: dict = Depends(get_current_user)):
#     docs = load_docs_metadata()
#     return {"documents": docs}

# @router.delete("/documents/{doc_id}")
# def del_doc(doc_id: int, current_user: dict = Depends(get_current_user)):
#     docs = load_docs_metadata()
#     docs = [doc for doc in docs if doc.get("id") != doc_id]
#     save_docs_metadata(docs)
#     return {"message": "Deleted successfully"}




import os, json, shutil
from datetime import date
from fastapi import APIRouter, UploadFile, File, Depends
from app.dependencies import get_current_user
from app.services.pdf_service import process_and_index_pdf
from app.memory.faiss_db import download_from_cloud, upload_to_cloud

router = APIRouter(prefix="/upload", tags=["Upload"])
os.makedirs("uploads", exist_ok=True)
FILE = "uploaded_docs.json"

def load_docs():
    download_from_cloud(FILE)
    try: return json.load(open(FILE))
    except: return []

def save_docs(docs):
    json.dump(docs, open(FILE, "w"))
    upload_to_cloud(FILE)

@router.post("/pdf")
def upload(file: UploadFile = File(...), u: dict = Depends(get_current_user)):
    path = os.path.join("uploads", file.filename)
    with open(path, "wb") as b: shutil.copyfileobj(file.file, b)
    process_and_index_pdf(path, file.filename)
    d = load_docs()
    d.append({"id": len(d)+1, "filename": file.filename, "date": str(date.today())})
    save_docs(d)
    return {"msg": "OK"}

@router.get("/documents")
def get_docs(u: dict = Depends(get_current_user)):
    return {"documents": load_docs()}

@router.delete("/documents/{id}")
def del_doc(id: int, u: dict = Depends(get_current_user)):
    save_docs([x for x in load_docs() if x.get("id") != id])
    return {"msg": "Deleted"}