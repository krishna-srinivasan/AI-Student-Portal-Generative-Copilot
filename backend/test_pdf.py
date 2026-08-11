from app.services.document_service import (
    extract_text_from_pdf,
    split_text
)

text = extract_text_from_pdf("uploads/sample.pdf")

chunks = split_text(text)

print(f"Total Chunks: {len(chunks)}")

for i, chunk in enumerate(chunks):
    print(f"\n------ Chunk {i+1} ------\n")
    print(chunk)