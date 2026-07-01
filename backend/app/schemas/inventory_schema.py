from pydantic import BaseModel
from datetime import date


class InventoryCreate(BaseModel):

    medicine_id: int
    distributor_id: int

    batch_number: str

    manufacturing_date: date
    expiry_date: date
    stock_entry_date: date

    cost_price: float
    selling_price: float

    quantity: int


class InventoryResponse(BaseModel):

    batch_id: int

    medicine_id: int
    distributor_id: int

    batch_number: str

    quantity: int

    class Config:
        from_attributes = True