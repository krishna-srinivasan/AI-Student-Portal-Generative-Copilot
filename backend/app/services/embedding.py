# from sentence_transformers import SentenceTransformer

# # Load the model that matches your 384-dimensional FAISS index
# model = SentenceTransformer("all-MiniLM-L6-v2")

# def get_embedding(text: str):
#     # Generate the vector embedding and convert it to a Python list
#     embedding = model.encode(text)
#     return embedding.tolist()


import os
from google import genai
from google.genai import types

# Using your exact GOOGLE_API_KEY environment variable
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def get_embedding(text: str):
    response = client.models.embed_content(
        model='gemini-embedding-001',
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=384)
    )
    return response.embeddings[0].values