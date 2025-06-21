from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class Item(BaseModel):
    id: int
    box_id: int
    name: str
    note: Optional[str]
    photo_url: Optional[str] = None
    photo_filename: Optional[str] = None    
    created_at: datetime

    class Config:
        from_attributes = True
# Base schema
class BoxBase(BaseModel):
    number: str
    description: Optional[str]

# For box creation
class BoxCreate(BoxBase):
    pass

# For box updates
class BoxUpdate(BaseModel):
    number: Optional[str]
    description: Optional[str]

# Full box schema (response)
class Box(BoxBase):
    id: int
    created_at: datetime
    photo_url: Optional[str] = None
    photo_filename: Optional[str] = None

    class Config:
        from_attributes = True

# Box with nested items
class BoxWithItems(Box):
    items: List[Item] = []

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
    photo_url: Optional[str] = None
    photo_filename: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

