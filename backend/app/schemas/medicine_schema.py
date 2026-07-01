from pydantic import BaseModel


class MedicineCreate(BaseModel):

    medicine_name: str
    manufacturer: str


class MedicineResponse(BaseModel):

    medicine_id: int
    medicine_name: str
    manufacturer: str

    class Config:
        from_attributes = True