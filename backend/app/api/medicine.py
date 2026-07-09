from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.auth.dependencies import get_current_user
from app.database.database import get_db

from app.models.user import User
from app.models.medicine import Medicine
from app.models.inventory_batch import InventoryBatch

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
    user=db.query(User).filter(
        User.email==current_user["sub"]
    ).first()

    new_medicine=Medicine(
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
    user=db.query(User).filter(
        User.email==current_user["sub"]
    ).first()

    return db.query(Medicine).filter(
        Medicine.user_id==user.id
    ).all()


@router.get("/search")
def search_medicine_with_manufacturer(
    medicine_name:str,
    manufacturer:str|None=None,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    user=db.query(User).filter(
        User.email==current_user["sub"]
    ).first()

    query=db.query(Medicine).filter(
        Medicine.medicine_name.ilike(f"%{medicine_name}%"),
        Medicine.user_id==user.id
    )

    if manufacturer:
        query=query.filter(
            Medicine.manufacturer.ilike(f"%{manufacturer}%")
        )

    result=query.all()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    return result


@router.post("/recalculate-stock")
def recalculate_stock(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user=db.query(User).filter(
        User.email==current_user["sub"]
    ).first()

    medicines=db.query(Medicine).filter(
        Medicine.user_id==user.id
    ).all()

    today=date.today()

    for medicine in medicines:

        valid_stock=db.query(
            InventoryBatch
        ).filter(
            InventoryBatch.user_id==user.id,
            InventoryBatch.medicine_id==medicine.medicine_id,
            InventoryBatch.expiry_date>=today
        ).all()

        medicine.quantity=sum(
            batch.quantity
            for batch in valid_stock
        )

    db.commit()

    return {
        "message":"Stock recalculated successfully"
    }