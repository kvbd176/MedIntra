from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.database.database import get_db

from app.models.customer import Customer
from app.models.invoice import Invoice

from app.schemas.customer_schema import (
    CustomerCreate,
    CustomerResponse
)
from fastapi import HTTPException

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post(
    "/",
    response_model=CustomerResponse
)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    new_customer = Customer(
        customer_name=customer.customer_name,
        phone_number=customer.phone_number,
        user_id=user.id
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@router.get(
    "/",
    response_model=list[CustomerResponse]
)
def get_customers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    return db.query(Customer).filter(
    Customer.user_id == user.id
    ).all()

@router.get("/history/{phone_number}")
def customer_history(
    phone_number: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    customer = db.query(
        Customer
    ).filter(
        Customer.phone_number == phone_number,
        Customer.user_id == user.id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    invoices = db.query(
        Invoice
    ).filter(
        Invoice.customer_id == customer.customer_id,
        Invoice.user_id == user.id
    ).all()

    purchase_history = []

    total_spent = 0

    for invoice in invoices:

        purchase_history.append({
        "invoice_id": invoice.invoice_id,
        "total_amount": invoice.total_amount,
        "pdf_download":
        f"/pdf/invoice/{invoice.invoice_id}"
        })

        total_spent += invoice.total_amount

    return {
        "customer_name": customer.customer_name,
        "phone_number": customer.phone_number,
        "total_visits": len(invoices),
        "total_spent": total_spent,
        "purchase_history": purchase_history
    }