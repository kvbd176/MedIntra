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

router = APIRouter(
    prefix="/distributors",
    tags=["Distributors"]
)


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