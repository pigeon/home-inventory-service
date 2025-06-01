from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import List, Optional

class Box(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    number: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    items: List["Item"] = Relationship(back_populates="box", sa_relationship_kwargs={"cascade": "all, delete"})

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    box_id: int = Field(foreign_key="box.id")
    name: str
    note: Optional[str] = None
    photo_filename: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    box: Box = Relationship(back_populates="items")