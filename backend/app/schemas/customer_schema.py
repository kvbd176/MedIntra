from pydantic import BaseModel


class CustomerCreate(BaseModel):
    customer_name: str
    phone_number: str


class CustomerResponse(BaseModel):
    customer_id: int
    customer_name: str
    phone_number: str

    class Config:
        from_attributes = True