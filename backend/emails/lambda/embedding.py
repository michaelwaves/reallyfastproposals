from dotenv import load_dotenv
import os
import requests
load_dotenv()

EMBEDDINGS_API_LINK = os.getenv("EMBEDDINGS_API_LINK")
EMBEDDINGS_API_KEY = os.getenv("EMBEDDINGS_API_KEY")


def create_embedding(text: str):
    headers = {"x-api-key": EMBEDDINGS_API_KEY}
    """Creates a CPU-friendly embedding for the given text."""
    res = requests.get(
        f"{EMBEDDINGS_API_LINK}/embedding/create?query={text}", headers=headers)
    embedding = res.json()
    return embedding
