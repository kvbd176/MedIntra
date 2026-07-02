from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.database.database import get_db

from app.models.distributor import Distributor

from app.schemas.distributor_schema import (
    DistributorCreate,
    DistributorResponse
)
from app.models.inventory_batch import InventoryBatch
from app.models.medicine import Medicine

router = APIRouter(
    prefix="/distributors",
    tags=["Distributors"]
)

from fastapi import HTTPException

@router.post(
    "/",
    response_model=DistributorResponse
)
def add_distributor(
    distributor: DistributorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    new_distributor = Distributor(
        distributor_name=distributor.distributor_name,
        phone=distributor.phone,
        email=distributor.email,
        address=distributor.address,
        user_id=user.id
    )

    db.add(new_distributor)
    db.commit()
    db.refresh(new_distributor)

    return new_distributor


@router.get(
    "/",
    response_model=list[DistributorResponse]
)
def get_distributors(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    return db.query(Distributor).filter(
    Distributor.user_id == user.id
    ).all()

from fastapi import HTTPException

@router.get("/search/{distributor_name}")
def search_distributor(
    distributor_name: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    distributor = db.query(
        Distributor
    ).filter(
        Distributor.distributor_name.ilike(
            f"%{distributor_name}%"
        ),
        Distributor.user_id == user.id
    ).first()

    if not distributor:
        raise HTTPException(
            status_code=404,
            detail="Distributor not found"
        )

    batches = db.query(
        InventoryBatch
    ).filter(
        InventoryBatch.distributor_id ==
        distributor.distributor_id,
        InventoryBatch.user_id ==
        user.id
    ).all()

    supplied_medicines = []

    total_purchase_value = 0

    for batch in batches:

        medicine = db.query(
            Medicine
        ).filter(
            Medicine.medicine_id ==
            batch.medicine_id
        ).first()

        amount_paid = (
            batch.initial_quantity *
            batch.cost_price
        )

        total_purchase_value += amount_paid

        supplied_medicines.append({
            "medicine_name":
            medicine.medicine_name,

            "batch_number":
            batch.batch_number,

            "initial_quantity":
            batch.initial_quantity,

            "quantity":
            batch.quantity,

            "purchase_price":
            batch.cost_price,

            "amount_paid":
            amount_paid
        })

    return {
        "distributor_name":
        distributor.distributor_name,

        "phone":
        distributor.phone,

        "total_purchase_value":
        total_purchase_value,

        "supplied_medicines":
        supplied_medicines
    }