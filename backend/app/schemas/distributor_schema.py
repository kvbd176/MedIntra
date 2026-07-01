from pydantic import BaseModel


class DistributorCreate(BaseModel):

    distributor_name: str
    phone: str | None = None
    email: str | None = None
    address: str | None = None


class DistributorResponse(BaseModel):

    distributor_id: int
    distributor_name: str
    phone: str | None = None
    email: str | None = None
    address: str | None = None

    class Config:
        from_attributes = True