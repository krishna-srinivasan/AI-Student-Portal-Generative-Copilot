from sentence_transformers import SentenceTransformer

# Load the model that matches your 384-dimensional FAISS index
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str):
    # Generate the vector embedding and convert it to a Python list
    embedding = model.encode(text)
    return embedding.tolist()