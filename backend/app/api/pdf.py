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

from app.utils.pdf_generator import (
    generate_invoice_pdf
)

from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/pdf",
    tags=["PDF"]
)


@router.get("/invoice/{invoice_id}")
def generate_pdf(
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
        Invoice.user_id==user.id
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

    invoice_items = db.query(
        InvoiceItem
    ).filter(
        InvoiceItem.invoice_id == invoice_id
    ).all()

    items = []

    for item in invoice_items:

        medicine = db.query(
            Medicine
        ).filter(
            Medicine.medicine_id == item.medicine_id,
            Medicine.user_id==user.id
        ).first()

        items.append({
            "medicine_name":
            medicine.medicine_name,

            "quantity":
            item.quantity,

            "subtotal":
            item.subtotal
        })

    filename = (
        f"invoice_{invoice_id}.pdf"
    )

    customer_name = customer.customer_name
    customer_phone = customer.phone_number
    total_amount = invoice.total_amount
    pharmacy_name = user.pharmacy_name
    owner_name = user.owner_name
    phone = user.phone

    generate_invoice_pdf(
        pharmacy_name,
        owner_name,
        phone,
        invoice_id,
        customer_name,
        customer_phone,
        items,
        total_amount,
        filename
    )

    return FileResponse(
    path=filename,
    media_type="application/pdf",
    filename=filename
    )