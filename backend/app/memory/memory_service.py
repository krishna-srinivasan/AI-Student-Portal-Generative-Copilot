from app.memory.embeddings import get_embedding
from app.memory.faiss_db import add_memory, search_memory

def save_memory(question: str, answer: str):
    text = f"Question: {question}\nAnswer: {answer}"

    embedding = get_embedding(text)

    add_memory(
        embedding,
        {
            "question": question,
            "answer": answer
        }
    )

    print("✅ Memory Saved to FAISS")


def retrieve_memory(query: str):
    embedding = get_embedding(query)
    return search_memory(embedding)