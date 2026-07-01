from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

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
    db: Session = Depends(get_db)
):

    new_distributor = Distributor(
        distributor_name=distributor.distributor_name,
        phone=distributor.phone,
        email=distributor.email,
        address=distributor.address
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
    db: Session = Depends(get_db)
):

    return db.query(Distributor).all()