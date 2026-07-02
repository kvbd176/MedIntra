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
        user_id=user.id
    )

    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    return new_batch


@router.get(
    "/",
    response_model=list[InventoryResponse]
)
def get_inventory(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    return db.query(
    InventoryBatch
    ).filter(
        InventoryBatch.user_id == user.id
    ).all()