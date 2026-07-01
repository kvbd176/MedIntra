from fastapi import FastAPI
from app.models.user import User

from app.models.medicine import Medicine
from app.models.distributor import Distributor
from app.models.inventory_batch import InventoryBatch

from app.api.medicine import router as medicine_router

from app.database.database import (
    engine,
    Base
)

from app.api.distributor import (
    router as distributor_router
)

from app.api.inventory import (
    router as inventory_router
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

app.include_router(medicine_router)
app.include_router(distributor_router)
app.include_router(inventory_router)


@app.get("/")
def home():
    return {
        "message": "MediTrack Pro Running"
    }