import faiss
import numpy as np

# Embedding size of all-MiniLM-L6-v2
dimension = 384

# Create FAISS index
index = faiss.IndexFlatL2(dimension)

# Store chat metadata
memory_store = []


def add_memory(vector, data):
    vector = np.array([vector]).astype("float32")
    index.add(vector)
    memory_store.append(data)


def search_memory(vector, top_k=3):
    if index.ntotal == 0:
        return []

    vector = np.array([vector]).astype("float32")

    distances, indices = index.search(vector, top_k)

    results = []

    for idx in indices[0]:
        if idx != -1:
            results.append(memory_store[idx])

    return results