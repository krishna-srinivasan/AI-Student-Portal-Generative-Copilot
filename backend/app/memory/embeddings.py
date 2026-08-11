# from sentence_transformers import SentenceTransformer

# model = SentenceTransformer("all-MiniLM-L6-v2")


# def get_embedding(text: str):
#     return model.encode(text)

from app.services.embedding import get_embedding