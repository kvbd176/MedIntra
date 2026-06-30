from fastapi import FastAPI

from app.database.database import (
    engine,
    Base
)

from app.models.user import User

from app.api.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediTrack Pro API"
)

app.include_router(
    auth_router,
    tags=["Authentication"]
)


@app.get("/")
def home():
    return {
        "message": "MediTrack Pro Running"
    }