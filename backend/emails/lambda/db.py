from sqlalchemy import create_engine, select, insert, Table, MetaData
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.reflect(engine)

users = metadata.tables["users"]
settings = metadata.tables["settings"]


def get_user_context(user_id):
    with engine.begin() as conn:
        stmt = select(settings).where(settings.c.userid == user_id)
        result = conn.execute(stmt)
        data = result.mappings().all()
    return data


if __name__ == "__main__":
    res = get_user_context(1)
    print(res)
