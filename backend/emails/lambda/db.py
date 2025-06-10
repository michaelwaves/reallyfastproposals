from sqlalchemy import create_engine, select, insert, Table, MetaData, asc, literal, join
from dotenv import load_dotenv
import os
from embedding import create_embedding

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.reflect(engine)

users = metadata.tables["users"]
settings = metadata.tables["settings"]
rfps = metadata.tables["rfps"]


def get_user(user_id):
    with engine.begin() as conn:
        stmt = select(settings).where(settings.c.userid == user_id)
        result = conn.execute(stmt)
        data = result.mappings().first()
    return data


def get_subscribed_users():
    j = join(settings, users, settings.c.userid == users.c.id)
    with engine.begin() as conn:
        stmt = select(j).where(settings.c.notifications == True)
        result = conn.execute(stmt)
        data = result.mappings().all()
    return data


def search_rfps(query: str, top_k: int, from_date=None):
    embedding = create_embedding(query)
    embedding_str = f"{embedding}"
    stmt = (
        select(rfps,
               (rfps.c.embedding.op("<->")(literal(embedding_str))).label("similarity"))
        .order_by(asc("similarity"))
        .limit(top_k)
    )
    with engine.begin() as conn:
        results = conn.execute(stmt)
        data = results.mappings().all()
        return [
            {
                "id": rfp["id"],
                "title": rfp["title"],
                "organization": rfp["organization"],
                "link": rfp["link"],
                "similarity": float(rfp["similarity"]),
            }
            for rfp in data
        ]


if __name__ == "__main__":
    # res = get_user(1)
    # rfps = search_rfps(res["context"], 5)
    # print(res)
    # print(rfps)

    subscribed_users = get_subscribed_users()
    for user in subscribed_users:
        rfps = search_rfps(user["context"], 2)
        print(rfps)
