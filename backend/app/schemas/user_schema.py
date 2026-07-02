from pydantic import BaseModel,EmailStr

class UserRegister(BaseModel):
    username:str
    email:EmailStr
    password:str
    pharmacy_name: str
    owner_name: str
    phone: str

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    pharmacy_name: str
    owner_name: str
    phone: str

    class Config:
        from_attributes = True