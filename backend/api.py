from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import ScoredPoint
import uvicorn

# Initialize FastAPI
app = FastAPI()

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Qdrant client setup
qdrant_client = QdrantClient("http://localhost:6333")
COLLECTION_NAME = "APARAVI"

# Embedding helper
def get_context_embedding(company_context: str):
    return model.encode(company_context, convert_to_tensor=False)

# Response model
class SearchResult(BaseModel):
    score: float
    text: str
    link: str

@app.get("/search", response_model=List[SearchResult])
def search_qdrant(
    text: str = Query(..., description="Text query for similarity search"),
    limit: int = Query(5, ge=1, le=50, description="Max number of results"),
    min_score: float = Query(0.75, ge=0.0, le=1.0, description="Minimum cosine similarity score")
):
    # Embed the query text
    query_vector = get_context_embedding(text)

    # Search in Qdrant
    results: List[ScoredPoint] = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=limit,
        with_payload=True
    )

    # Filter by score
    filtered = [
        SearchResult(
            score=point.score,
            text=point.payload.get("text"),
            link=point.payload.get("link")
        )
        for point in results if point.score >= min_score
    ]

    return filtered

if __name__ == "__main__":
    uvicorn.run("api:app",host="0.0.0.0", port=8000, reload=True)
