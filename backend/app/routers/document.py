from fastapi import APIRouter, UploadFile, File
import shutil

from app.services.document_service import (
    extract_text_from_pdf,
    split_text
)

from app.services.rag import build_document_index

router = APIRouter(tags=["Document"])


@router.post("/document/upload")
async def upload_document(file: UploadFile = File(...)):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)

    chunks = split_text(text)

    build_document_index(chunks)

    return {
        "message": "Document uploaded successfully",
        "chunks": len(chunks)
    }