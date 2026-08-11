import faiss
import numpy as np
import pickle
import os

dimension = 384

INDEX_FILE = "faiss.index"
MEMORY_FILE = "memory_store.pkl"


if os.path.exists(INDEX_FILE):
    index = faiss.read_index(INDEX_FILE)
else:
    index = faiss.IndexFlatL2(dimension)


if os.path.exists(MEMORY_FILE):
    with open(MEMORY_FILE, "rb") as f:
        memory_store = pickle.load(f)
else:
    memory_store = []


def save_index():
    faiss.write_index(index, INDEX_FILE)

    with open(MEMORY_FILE, "wb") as f:
        pickle.dump(memory_store, f)


def add_memory(vector, data):
    vector = np.array([vector]).astype("float32")

    index.add(vector)

    memory_store.append(data)

    save_index()


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