from app.services.document_service import (
    extract_text_from_pdf,
    split_text
)

from app.services.rag import (
    build_document_index,
    search_document
)

text = extract_text_from_pdf("uploads/sample.pdf")

chunks = split_text(text)

build_document_index(chunks)

results = search_document(
    "What programming languages do I know?"
)

print("\nRetrieved Chunks:\n")

for chunk in results:
    print("----------------------")
    print(chunk)