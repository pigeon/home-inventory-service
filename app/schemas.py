from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class Item(BaseModel):
    id: int
    box_id: int
    name: str
    note: Optional[str]
    photo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
class BoxBase(BaseModel):
    number: str
    description: Optional[str]

class BoxCreate(BoxBase):
    pass

class BoxUpdate(BaseModel):
    number: Optional[str]
    description: Optional[str]

class Box(BoxBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BoxWithItems(Box):
    items: List[Item] = []    # ← add this!

    class Config:
        from_attributes = True
class ItemBase(BaseModel):
    name: str
    note: Optional[str]

class ItemCreate(ItemBase):
    pass  # photo handled in endpoint

class ItemUpdate(BaseModel):
    name: Optional[str]
    note: Optional[str]

class Item(ItemBase):
    id: int
    box_id: int
    pphoto_url: Optional[str] = None 
    created_at: datetime
    class Config:
        from_attributes = True