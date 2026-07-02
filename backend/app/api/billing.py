from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.database.database import get_db

from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem

from app.models.inventory_batch import InventoryBatch
from app.models.medicine import Medicine

from app.schemas.billing_schema import InvoiceCreate

router = APIRouter(
    prefix="/billing",
    tags=["Billing"]
)

@router.post("/create-invoice")
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
    User.email == current_user["sub"]
    ).first()

    total_amount = 0

    invoice = Invoice(
        customer_id=invoice_data.customer_id,
        total_amount=0,
        user_id=user.id
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    for item in invoice_data.items:

        batch = db.query(
            InventoryBatch
        ).filter(
            InventoryBatch.medicine_id == item.medicine_id,
            InventoryBatch.user_id==user.id
        ).first()

        if not batch:

            raise HTTPException(
                status_code=404,
                detail=f"Medicine {item.medicine_id} not found"
            )

        if batch.quantity < item.quantity:

            raise HTTPException(
                status_code=400,
                detail="Not enough stock"
            )

        subtotal = (
            batch.selling_price *
            item.quantity
        )

        invoice_item = InvoiceItem(
            invoice_id=invoice.invoice_id,
            medicine_id=item.medicine_id,
            quantity=item.quantity,
            unit_price=batch.selling_price,
            subtotal=subtotal
        )

        db.add(invoice_item)

        batch.quantity -= item.quantity

        total_amount += subtotal

    invoice.total_amount = total_amount

    db.commit()

    return {
        "invoice_id": invoice.invoice_id,
        "total_amount": total_amount
    }