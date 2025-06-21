from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import event
import os

DATABASE_URL = "sqlite:///./data/inventory.db"
os.makedirs("./data", exist_ok=True)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# enable FTS5 on startup
@event.listens_for(engine, "connect")
def _enable_sqlite_fts(dbapi_conn, conn_record):
    dbapi_conn.enable_load_extension(True)
    try:
        dbapi_conn.execute('SELECT load_extension("fts5")')
    except Exception:
        pass

def init_db():
    from app import models
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
