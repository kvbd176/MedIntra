from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.database.database import get_db

from app.models.medicine import Medicine

from app.schemas.medicine_schema import (
    MedicineCreate,
    MedicineResponse
)

router = APIRouter(
    prefix="/medicines",
    tags=["Medicines"]
)

@router.post(
    "/",
    response_model=MedicineResponse
)
def add_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    new_medicine = Medicine(
    medicine_name=medicine.medicine_name,
    manufacturer=medicine.manufacturer,
    quantity=0,
    user_id=user.id
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return new_medicine


@router.get(
    "/",
    response_model=list[MedicineResponse]
)
def get_medicines(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    return db.query(Medicine).filter(
    Medicine.user_id == user.id
    ).all()

#search by manufacturer
@router.get("/search")
def search_medicine_with_manufacturer(
    medicine_name: str,
    manufacturer: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    query = db.query(Medicine)

    query = query.filter(
        Medicine.medicine_name.ilike(
            f"%{medicine_name}%"
        ),
        Medicine.user_id==user.id
    )

    if manufacturer:

        query = query.filter(
            Medicine.manufacturer.ilike(
                f"%{manufacturer}%"
            ),
            Medicine.user_id==user.id
        )

    result = query.all()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    return result