from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.database.database import get_db

from app.models.inventory_batch import (
    InventoryBatch
)

from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryResponse
)

from app.models.medicine import Medicine
from app.models.distributor import Distributor

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.post(
    "/",
    response_model=InventoryResponse
)
def add_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    new_batch = InventoryBatch(
        medicine_id=inventory.medicine_id,
        distributor_id=inventory.distributor_id,

        batch_number=inventory.batch_number,

        manufacturing_date=inventory.manufacturing_date,
        expiry_date=inventory.expiry_date,
        stock_entry_date=inventory.stock_entry_date,

        cost_price=inventory.cost_price,
        selling_price=inventory.selling_price,

        quantity=inventory.quantity,
        initial_quantity=inventory.quantity,
        user_id=user.id
    )
    

    db.add(new_batch)
    medicine=db.query(Medicine).filter(
    Medicine.medicine_id==inventory.medicine_id
    ).first()
    medicine.quantity+=inventory.quantity
    db.commit()
    db.refresh(new_batch)

    return new_batch


@router.get("/")
def get_inventory(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    inventory = db.query(
        InventoryBatch
    ).filter(
        InventoryBatch.user_id == user.id
    ).all()

    result = []

    for batch in inventory:

        medicine = db.query(Medicine).filter(
            Medicine.medicine_id ==
            batch.medicine_id
        ).first()

        distributor = db.query(
            Distributor
        ).filter(
            Distributor.distributor_id ==
            batch.distributor_id
        ).first()

        result.append({

            "batch_id":
            batch.batch_id,

            "medicine_id":
            batch.medicine_id,

            "medicine_name":
            medicine.medicine_name,

            "distributor_id":
            batch.distributor_id,

            "distributor_name":
            distributor.distributor_name,

            "manufacturer":
            medicine.manufacturer,

            "batch_number":
            batch.batch_number,

            "initial_quantity":
            batch.initial_quantity,

            "quantity":
            batch.quantity,

            "cost_price":
            batch.cost_price,

            "selling_price":
            batch.selling_price,

            "expiry_date":
            batch.expiry_date

        })

    return result