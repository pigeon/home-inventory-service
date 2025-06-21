from fastapi import FastAPI, Depends, UploadFile, File, Form, Query
from typing import Optional
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session
from app import crud, schemas, database
from .database import get_session as get_db




app = FastAPI()
app.mount("/photos", StaticFiles(directory="./data/photos"), name="photos")
app.mount("/web", StaticFiles(directory="./frontend", html=True), name="frontend")

database.init_db()


@app.get("/health")
def health() -> dict[str, str]:
    """Simple health check endpoint."""
    return {"status": "ok"}

@app.get("/boxes", response_model=list[schemas.Box])
def list_boxes(session: Session = Depends(database.get_session)):
    return crud.get_boxes(session)

# @app.post("/boxes", response_model=schemas.Box)
# async def create_box(
#     number: str = Form(...),
#     description: Optional[str] = Form(None),
#     photo: Optional[UploadFile] = File(None),
#     db: Session = Depends(get_db)
# ):
#     photo_filename = None
#     photo_url = None

#     if photo:
#         photo_filename = f"{uuid4()}.jpg"
#         photo_path = os.path.join("data/photos", photo_filename)
#         with open(photo_path, "wb") as f:
#             f.write(await photo.read())
#         photo_url = f"/photos/{photo_filename}"

#     box = models.Box(
#         number=number,
#         description=description,
#         photo_filename=photo_filename,
#         photo_url=photo_url,
#     )
#     db.add(box)
#     db.commit()
#     db.refresh(box)
#     return box

@app.post("/boxes", response_model=schemas.Box)
def create_box(
    number: str = Form(...),
    description: Optional[str] = Form(None),
    photo: UploadFile = File(None), 
    session: Session = Depends(database.get_session)):
    return crud.create_box(session, number, description, photo)


@app.get("/boxes/{box_id}", response_model=schemas.BoxWithItems)
def get_box(box_id: int, session: Session = Depends(database.get_session)):
    box = crud.get_box(session, box_id)
    box.items  # load items
    return box

@app.put("/boxes/{box_id}", response_model=schemas.Box)
def update_box(box_id: int, box: schemas.BoxUpdate, session: Session = Depends(database.get_session)):
    return crud.update_box(session, box_id, box)

@app.delete("/boxes/{box_id}", status_code=204)
def delete_box(box_id: int, session: Session = Depends(database.get_session)):
    crud.delete_box(session, box_id)

@app.post("/boxes/{box_id}/items", response_model=schemas.Item, status_code=201)
def create_item(
    box_id: int,
    name: str = Form(...),
    note: Optional[str] = Form(None),
    photo: UploadFile = File(None),
    session: Session = Depends(database.get_session)
):
    return crud.create_item(session, box_id, name, note, photo)

@app.get("/items/{item_id}", response_model=schemas.Item)
def get_item(item_id: int, session: Session = Depends(database.get_session)):
    item = crud.get_item(session, item_id)
    if item.photo_filename:
        item.photo_url = f"/photos/{item.photo_filename}"
    return item

@app.put("/items/{item_id}", response_model=schemas.Item)
def update_item(
    item_id: int,
    name: Optional[str] = Form(None),
    note: Optional[str] = Form(None),
    photo: UploadFile = File(None),
    session: Session = Depends(database.get_session)
):
    item = crud.update_item(session, item_id, name, note, photo)
    if item.photo_filename:
        item.photo_url = f"/photos/{item.photo_filename}"
    return item

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, session: Session = Depends(database.get_session)):
    crud.delete_item(session, item_id)

@app.get("/search", response_model=list[schemas.Item])
def search(
    query: str = Query(...),
    session: Session = Depends(database.get_session)
):
    items = crud.search_items(session, query)
    for item in items:
        if item.photo_filename:
            item.photo_url = f"/photos/{item.photo_filename}"
    return items
