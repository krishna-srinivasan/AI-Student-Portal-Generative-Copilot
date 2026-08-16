# import PyPDF2
# from app.memory.faiss_db import add_memory
# from app.services.embedding import get_embedding

# def process_and_index_pdf(file_path: str, filename: str):
#     with open(file_path, "rb") as f:
#         reader = PyPDF2.PdfReader(f)
#         text = "".join(p.extract_text() for p in reader.pages if p.extract_text())

#     chunks = [text[i:i+500] for i in range(0, len(text), 450)]
#     for chunk in chunks:
#         if chunk.strip():
#             add_memory(get_embedding(chunk), {"file": filename, "text": chunk})


import PyPDF2
from app.memory.faiss_db import add_memory, save_index
from app.services.embedding import get_embedding

def process_and_index_pdf(file_path: str, filename: str):
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = "".join(p.extract_text() for p in reader.pages if p.extract_text())

    chunks = [text[i:i+500] for i in range(0, len(text), 450)]
    
    for chunk in chunks:
        if chunk.strip():
            # Pass save_now=False during chunk iteration
            add_memory(get_embedding(chunk), {"file": filename, "text": chunk}, save_now=False)
            
    # Save once after full file processing completes
    save_index()
    print(f"Indexed {filename} into FAISS database.")