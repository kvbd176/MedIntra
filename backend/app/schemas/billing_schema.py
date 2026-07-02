from pydantic import BaseModel


class InvoiceItemCreate(BaseModel):
    medicine_id: int
    quantity: int


class InvoiceCreate(BaseModel):
    customer_id: int
    items: list[InvoiceItemCreate]