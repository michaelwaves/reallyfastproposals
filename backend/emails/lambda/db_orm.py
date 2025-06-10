from sqlalchemy import create_engine, select, insert, Table
from dotenv import load_dotenv
from sqlalchemy.orm import Session, declarative_base
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

Base = declarative_base()
engine = create_engine(DATABASE_URL)


class User(Base):
    __tablename__ = "users"
    __table__ = Table("users", Base.metadata, autoload_with=engine)


class Settings(Base):
    __tablename__ = "settings"
    __table__ = Table("settings", Base.metadata, autoload_with=engine)


def get_user_context(user_id):
    with Session(engine) as session, session.begin():
        stmt = select(Settings).where(Settings.userid == user_id)
        result = session.execute(stmt)
        data = result.mappings().all()
    return data


if __name__ == "__main__":
    res = get_user_context(1)
    print(res)
