from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.database.database import engine,Base

from app.models.medicine import Medicine
from app.models.distributor import Distributor
from app.models.inventory_batch import InventoryBatch
from app.models.customer import Customer
from app.models.user import User
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem

from app.api.invoice import router as invoice_router
from app.api.medicine import router as medicine_router
from app.api.distributor import router as distributor_router
from app.api.inventory import router as inventory_router
from app.api.customer import router as customer_router
from app.api.auth import router as auth_router
from app.api.billing import router as billing_router
from app.api.pdf import router as pdf_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="MediTrack Pro API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#routers
app.include_router(auth_router,tags=["Authentication"])
app.include_router(medicine_router)
app.include_router(distributor_router)
app.include_router(inventory_router)
app.include_router(customer_router)
app.include_router(billing_router)
app.include_router(invoice_router)
app.include_router(pdf_router)
app.include_router(dashboard_router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "MediTrack Pro Running"
    }