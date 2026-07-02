from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.database.database import get_db

from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.models.customer import Customer
from app.models.medicine import Medicine

from fastapi import HTTPException

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)


@router.get("/")
def get_invoices(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    invoices = db.query(
        Invoice
    ).filter(
        Invoice.user_id == user.id
    ).all()

    result = []

    for invoice in invoices:

        customer = db.query(
            Customer
        ).filter(
            Customer.customer_id ==
            invoice.customer_id,
            Customer.user_id ==
            user.id
        ).first()

        result.append({
            "invoice_id":
            invoice.invoice_id,

            "customer_name":
            customer.customer_name,

            "customer_phone":
            customer.phone_number,

            "total_amount":
            invoice.total_amount,

            "invoice_date":
            invoice.created_at
        })

    return result


# Get Invoice By ID
@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    invoice = db.query(
    Invoice
    ).filter(
        Invoice.invoice_id == invoice_id,
        Invoice.user_id == user.id
    ).first()

    if not invoice:
        raise HTTPException(
        status_code=404,
        detail="Invoice not found"
        )

    customer = db.query(
        Customer
    ).filter(
        Customer.customer_id == invoice.customer_id,
        Customer.user_id==user.id
    ).first()

    items = db.query(
        InvoiceItem
    ).filter(
        InvoiceItem.invoice_id == invoice_id,
    ).all()

    invoice_items = []

    for item in items:

        medicine = db.query(
            Medicine
        ).filter(
            Medicine.medicine_id == item.medicine_id,
            Medicine.user_id==user.id
        ).first()

        invoice_items.append({
            "medicine_name": medicine.medicine_name,
            "quantity": item.quantity,
            "subtotal": item.subtotal
        })

    return {
        "invoice_id": invoice.invoice_id,
        "customer_name": customer.customer_name,
        "customer_phone": customer.phone_number,
        "total_amount": invoice.total_amount,
        "pdf_url":
        f"/pdf/invoice/{invoice.invoice_id}",
        "items": invoice_items
    }