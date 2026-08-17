# import faiss
# import numpy as np
# import pickle
# import os

# dimension = 384

# INDEX_FILE = "faiss.index"
# MEMORY_FILE = "memory_store.pkl"

# # Global holders
# index = None
# memory_store = []

# def initialize_store():
#     global index, memory_store
    
#     # Load or create FAISS index safely
#     if os.path.exists(INDEX_FILE):
#         try:
#             index = faiss.read_index(INDEX_FILE)
#         except Exception as e:
#             print(f"Error reading FAISS index, creating new: {e}")
#             index = faiss.IndexFlatL2(dimension)
#     else:
#         index = faiss.IndexFlatL2(dimension)

#     # Load or create metadata memory store safely
#     if os.path.exists(MEMORY_FILE):
#         try:
#             with open(MEMORY_FILE, "rb") as f:
#                 memory_store = pickle.load(f)
#         except Exception as e:
#             print(f"Error reading memory store pickle, resetting: {e}")
#             memory_store = []
#     else:
#         memory_store = []

# # Initialize on module load
# initialize_store()

# def save_index():
#     try:
#         faiss.write_index(index, INDEX_FILE)
#         with open(MEMORY_FILE, "wb") as f:
#             pickle.dump(memory_store, f)
#     except Exception as e:
#         print(f"Failed to save FAISS index/memory to disk: {e}")

# def add_memory(vector, data, save_now=True):
#     global index, memory_store
    
#     # Ensure index is initialized
#     if index is None:
#         initialize_store()

#     vector = np.array([vector]).astype("float32")
    
#     # Safety dimension check
#     if vector.shape[1] != dimension:
#         raise ValueError(f"Vector dimension mismatch: got {vector.shape[1]}, expected {dimension}")

#     index.add(vector)
#     memory_store.append(data)
    
#     if save_now:
#         save_index()

# def search_memory(vector, top_k=3):
#     global index, memory_store
    
#     if index is None or index.ntotal == 0:
#         return []

#     vector = np.array([vector]).astype("float32")
    
#     try:
#         distances, indices = index.search(vector, top_k)
#         results = []
#         for idx in indices[0]:
#             if idx != -1 and 0 <= idx < len(memory_store):
#                 results.append(memory_store[idx])
#         return results
#     except Exception as e:
#         print(f"Search memory error: {e}")
#         return []




import faiss
import numpy as np
import pickle
import os
from supabase import create_client, Client

# --- SUPABASE CONFIGURATION ---
# Use environment variables instead of hardcoding the secret!
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = "ai-memory"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ... (keep the rest of the file the same)

dimension = 384
INDEX_FILE = "faiss.index"
MEMORY_FILE = "memory_store.pkl"

index = None
memory_store = []

def download_from_cloud(filename):
    """Downloads a file from Supabase to Render's local disk."""
    try:
        # Download the bytes from Supabase
        res = supabase.storage.from_(BUCKET_NAME).download(filename)
        # Write the bytes to a local file
        with open(filename, 'wb') as f:
            f.write(res)
        print(f"✅ Downloaded {filename} from cloud.")
    except Exception as e:
        print(f"⚠️ Cloud download failed for {filename} (it might not exist yet): {e}")

def upload_to_cloud(filename):
    """Uploads a local file from Render's disk to Supabase."""
    try:
        # Upload the local file, using upsert=true to overwrite older versions
        with open(filename, 'rb') as f:
            supabase.storage.from_(BUCKET_NAME).upload(
                file=f, 
                path=filename, 
                file_options={"upsert": "true"}
            )
        print(f"☁️ Backed up {filename} to cloud.")
    except Exception as e:
        print(f"❌ Cloud backup failed for {filename}: {e}")

def initialize_store():
    global index, memory_store
    
    # 1. Force download from cloud BEFORE trying to read the files
    download_from_cloud(INDEX_FILE)
    download_from_cloud(MEMORY_FILE)
    
    if os.path.exists(INDEX_FILE):
        try:
            index = faiss.read_index(INDEX_FILE)
        except Exception:
            index = faiss.IndexFlatL2(dimension)
    else:
        index = faiss.IndexFlatL2(dimension)

    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "rb") as f:
                memory_store = pickle.load(f)
        except Exception:
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
            
        # 2. Force upload to cloud AFTER saving locally
        upload_to_cloud(INDEX_FILE)
        upload_to_cloud(MEMORY_FILE)
        
    except Exception as e:
        print(f"Failed to save FAISS index/memory: {e}")

def add_memory(vector, data, save_now=True):
    global index, memory_store
    
    if index is None:
        initialize_store()

    vector = np.array([vector]).astype("float32")
    
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