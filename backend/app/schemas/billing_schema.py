from pydantic import BaseModel


class InvoiceItemCreate(BaseModel):
    medicine_id: int
    quantity: int


class InvoiceCreate(BaseModel):
    customer_name: str
    phone_number: str
    items: list[InvoiceItemCreate]