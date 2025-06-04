from sqlalchemy import create_engine, Text, Boolean, Date, Table, insert
from dotenv import load_dotenv
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session
import os
from typing import Optional
from datetime import date
from pgvector.sqlalchemy import Vector
import json
import pandas  as pd

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

class Base(DeclarativeBase):
    pass
"""
#create rfps from scratch
class RFP(Base):
    __tablename__="rfps"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    link: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(Text)
    published: Mapped[Optional[date]] = mapped_column(Date)
    amended: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)
    closing_date: Mapped[Optional[date]] = mapped_column(Date)
    organization:Mapped[Optional[str]] = mapped_column(Text)
    embedding: Mapped[Optional[list[float]]] = mapped_column(Vector(384))

Base.metadata.create_all(engine)
"""

 #pull pre existing rfps table

class RFP(Base):
    __tablename__="rfps"
    __table__=Table("rfps", Base.metadata, autoload_with=engine)


# Load and clean data
with open("outputs.json", "r") as f:
    raw_data = json.load(f)

df = pd.DataFrame(raw_data)

# Convert dates, coercing errors to NaT
for col in ["published", "closing_date"]:
    df[col] = pd.to_datetime(df[col], errors="coerce").dt.date  # .date() strips time

# Now NaT values are just `None`, safe for SQLAlchemy
clean_data = df.where(pd.notnull(df), None).to_dict(orient="records")
with Session(engine) as session:
    session.execute(
        insert(RFP),
        clean_data
    )
    session.commit()