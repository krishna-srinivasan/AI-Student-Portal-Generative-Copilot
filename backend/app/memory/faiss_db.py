# import faiss
# import numpy as np
# import pickle
# import os

# dimension = 384

# INDEX_FILE = "faiss.index"
# MEMORY_FILE = "memory_store.pkl"


# if os.path.exists(INDEX_FILE):
#     index = faiss.read_index(INDEX_FILE)
# else:
#     index = faiss.IndexFlatL2(dimension)


# if os.path.exists(MEMORY_FILE):
#     with open(MEMORY_FILE, "rb") as f:
#         memory_store = pickle.load(f)
# else:
#     memory_store = []


# def save_index():
#     faiss.write_index(index, INDEX_FILE)

#     with open(MEMORY_FILE, "wb") as f:
#         pickle.dump(memory_store, f)


# def add_memory(vector, data):
#     vector = np.array([vector]).astype("float32")

#     index.add(vector)

#     memory_store.append(data)

#     save_index()


# def search_memory(vector, top_k=3):
#     if index.ntotal == 0:
#         return []

#     vector = np.array([vector]).astype("float32")

#     distances, indices = index.search(vector, top_k)

#     results = []

#     for idx in indices[0]:
#         if idx != -1:
#             results.append(memory_store[idx])

#     return results




# import faiss
# import numpy as np
# import pickle
# import os

# dimension = 384

# INDEX_FILE = "faiss.index"
# MEMORY_FILE = "memory_store.pkl"

# if os.path.exists(INDEX_FILE):
#     index = faiss.read_index(INDEX_FILE)
# else:
#     index = faiss.IndexFlatL2(dimension)

# if os.path.exists(MEMORY_FILE):
#     with open(MEMORY_FILE, "rb") as f:
#         memory_store = pickle.load(f)
# else:
#     memory_store = []

# def save_index():
#     faiss.write_index(index, INDEX_FILE)
#     with open(MEMORY_FILE, "wb") as f:
#         pickle.dump(memory_store, f)

# def add_memory(vector, data, save_now=True):
#     vector = np.array([vector]).astype("float32")
#     index.add(vector)
#     memory_store.append(data)
#     if save_now:
#         save_index()

# def search_memory(vector, top_k=3):
#     if index.ntotal == 0:
#         return []

#     vector = np.array([vector]).astype("float32")
#     distances, indices = index.search(vector, top_k)

#     results = []
#     for idx in indices[0]:
#         if idx != -1 and idx < len(memory_store):
#             results.append(memory_store[idx])

#     return results


import faiss
import numpy as np
import pickle
import os

dimension = 384

INDEX_FILE = "faiss.index"
MEMORY_FILE = "memory_store.pkl"

# Global holders
index = None
memory_store = []

def initialize_store():
    global index, memory_store
    
    # Load or create FAISS index safely
    if os.path.exists(INDEX_FILE):
        try:
            index = faiss.read_index(INDEX_FILE)
        except Exception as e:
            print(f"Error reading FAISS index, creating new: {e}")
            index = faiss.IndexFlatL2(dimension)
    else:
        index = faiss.IndexFlatL2(dimension)

    # Load or create metadata memory store safely
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "rb") as f:
                memory_store = pickle.load(f)
        except Exception as e:
            print(f"Error reading memory store pickle, resetting: {e}")
            memory_store = []
    else:
        memory_store = []

# Initialize on module load
initialize_store()

def save_index():
    try:
        faiss.write_index(index, INDEX_FILE)
        with open(MEMORY_FILE, "wb") as f:
            pickle.dump(memory_store, f)
    except Exception as e:
        print(f"Failed to save FAISS index/memory to disk: {e}")

def add_memory(vector, data, save_now=True):
    global index, memory_store
    
    # Ensure index is initialized
    if index is None:
        initialize_store()

    vector = np.array([vector]).astype("float32")
    
    # Safety dimension check
    if vector.shape[1] != dimension:
        raise ValueError(f"Vector dimension mismatch: got {vector.shape[1]}, expected {dimension}")

    index.add(vector)
    memory_store.append(data)
    
    if save_now:
        save_index()

def search_memory(vector, top_k=3):
    global index, memory_store
    
    if index is None or index.ntotal == 0:
        return []

    vector = np.array([vector]).astype("float32")
    
    try:
        distances, indices = index.search(vector, top_k)
        results = []
        for idx in indices[0]:
            if idx != -1 and 0 <= idx < len(memory_store):
                results.append(memory_store[idx])
        return results
    except Exception as e:
        print(f"Search memory error: {e}")
        return []