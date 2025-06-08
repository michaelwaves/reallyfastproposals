from fastapi import FastAPI, Query, Depends
from embedding import create_embedding
import uvicorn
from db import get_db, RFP
from sqlalchemy import select,  asc
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
)


@app.get("/search/rfps")
def search_rfps(query=Query(..., description="Query to search RFPs"),
                top_k: int = 5,
                db=Depends(get_db)
                ):
    embedding = create_embedding(query)

    stmt = (
        select(RFP, RFP.embedding.l2_distance(embedding).label("similarity"))
        .order_by(asc("similarity"))
        .limit(top_k)
    )
    results = db.execute(stmt).all()
    return [
        {
            "rfp": {
                "id": rfp.id,
                "title": rfp.title,
                "organization": rfp.organization,
                "link": rfp.link,
            },
            "similarity": float(similarity),
        }
        for rfp, similarity in results
    ]


@app.get("/embedding/create")
def embedding(query=Query(..., description="Query string to convert to embeddings")):
    embedding = create_embedding(query)
    return embedding


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
