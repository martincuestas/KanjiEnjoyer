from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import engine
from .models import Base
from .routers import auth, kanji, stats, study
from .seed.seed import run as seed_db

Base.metadata.create_all(bind=engine)
seed_db()

app = FastAPI(title="KanjiEnjoyer API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(kanji.router)
app.include_router(study.router)
app.include_router(stats.router)


@app.get("/health")
def health():
    return {"status": "ok"}
