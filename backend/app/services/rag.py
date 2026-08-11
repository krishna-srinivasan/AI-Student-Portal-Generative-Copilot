# import faiss
# import numpy as np
# import pickle

# from app.memory.embeddings import get_embedding

# dimension = 384

# index = faiss.IndexFlatL2(dimension)

# document_chunks = []


# def build_document_index(chunks):
#     global document_chunks

#     document_chunks = []

#     index.reset()

#     for chunk in chunks:
#         embedding = get_embedding(chunk)

#         index.add(
#             np.array([embedding]).astype("float32")
#         )

#         document_chunks.append(chunk)

#     faiss.write_index(index, "document.index")

#     with open("document_chunks.pkl", "wb") as f:
#         pickle.dump(document_chunks, f)

#     print("✅ Document FAISS Created")


# def load_document_index():
#     global index
#     global document_chunks

#     index = faiss.read_index("document.index")

#     with open("document_chunks.pkl", "rb") as f:
#         document_chunks = pickle.load(f)


# def search_document(query, top_k=3):

#     if index.ntotal == 0:
#         return []

#     embedding = get_embedding(query)

#     distances, indices = index.search(
#         np.array([embedding]).astype("float32"),
#         top_k
#     )

#     results = []

#     for idx in indices[0]:
#         if idx != -1:
#             results.append(document_chunks[idx])

#     return results


from app.services.embedding import get_embedding
from app.memory.faiss_db import search_memory

def search_document(query: str, top_k: int = 3):
    """
    Converts the user query to a vector, searches the main FAISS index, 
    and returns a list of relevant text chunks.
    """
    if not query.strip():
        return []

    try:
        query_vector = get_embedding(query)
        raw_results = search_memory(query_vector, top_k=top_k)
        
        chunks = []
        for match in raw_results:
            if isinstance(match, dict) and "text" in match:
                chunks.append(match["text"])
            elif isinstance(match, str):
                chunks.append(match)
                
        return chunks
        
    except Exception as e:
        print(f"RAG Search Error: {e}")
        return []


# --- Added these back to prevent ImportErrors in document.py ---

def build_document_index(chunks):
    """Placeholder: PDF indexing is now handled by pdf_service.py"""
    pass

def load_document_index():
    """Placeholder: FAISS loading is now handled automatically by faiss_db.py"""
    pass