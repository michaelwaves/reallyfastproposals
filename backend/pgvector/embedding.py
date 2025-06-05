from sentence_transformers import SentenceTransformer

# Load a lightweight model once
model = SentenceTransformer('all-MiniLM-L6-v2')

def create_embedding(text: str):
    """Creates a CPU-friendly embedding for the given text."""
    return model.encode(text).tolist()