from sqlmodel import select, Session
from fastapi import HTTPException, UploadFile
import shutil, os
import uuid
from app import models, schemas, database

PHOTOS_DIR = "./data/photos"
os.makedirs(PHOTOS_DIR, exist_ok=True)

# Box CRUD
def get_boxes(session: Session):
    return session.exec(select(models.Box)).all()

def get_box(session: Session, box_id: int):
    box = session.get(models.Box, box_id)
    if not box:
        raise HTTPException(404, "Box not found")
    return box

def create_box(session: Session, box: schemas.BoxCreate):
    db_box = models.Box.from_orm(box)
    session.add(db_box)
    session.commit()
    session.refresh(db_box)
    return db_box

def update_box(session: Session, box_id: int, box_up: schemas.BoxUpdate):
    box = get_box(session, box_id)
    for k,v in box_up.dict(exclude_none=True).items(): setattr(box, k, v)
    session.add(box)
    session.commit()
    return box

def delete_box(session: Session, box_id: int):
    box = get_box(session, box_id)
    session.delete(box)
    session.commit()

# Item CRUD
def create_item(session: Session, box_id: int, name: str, note: str, photo: UploadFile = None):
    get_box(session, box_id)
    filename = None
    if photo:
        ext = os.path.splitext(photo.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        with open(os.path.join(PHOTOS_DIR, filename), "wb") as f:
            shutil.copyfileobj(photo.file, f)
    db_item = models.Item(box_id=box_id, name=name, note=note, photo_filename=filename)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def get_item(session: Session, item_id: int):
    item = session.get(models.Item, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    return item

def update_item(session: Session, item_id: int, name: str = None, note: str = None, photo: UploadFile = None):
    item = get_item(session, item_id)
    if name: item.name = name
    if note: item.note = note
    if photo:
        if item.photo_filename:
            try: os.remove(os.path.join(PHOTOS_DIR, item.photo_filename))
            except: pass
        ext = os.path.splitext(photo.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        with open(os.path.join(PHOTOS_DIR, filename), "wb") as f:
            shutil.copyfileobj(photo.file, f)
        item.photo_filename = filename
    session.add(item)
    session.commit()
    return item

def delete_item(session: Session, item_id: int):
    item = get_item(session, item_id)
    if item.photo_filename:
        try: os.remove(os.path.join(PHOTOS_DIR, item.photo_filename))
        except: pass
    session.delete(item)
    session.commit()

# Search
def search_items(session: Session, query: str):
    q = select(models.Item).where(models.Item.name.contains(query) | models.Item.note.contains(query))
    return session.exec(q).all()