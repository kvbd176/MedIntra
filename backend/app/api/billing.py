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

from app.models.customer import Customer

@router.post("/create-invoice")
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not invoice_data.customer_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Customer name is required"
        )

    if not invoice_data.phone_number.strip():
        raise HTTPException(
            status_code=400,
            detail="Phone number is required"
        )

    if len(invoice_data.items) == 0:
        raise HTTPException(
            status_code=400,
            detail="Add at least one medicine"
        )

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    # --------------------------
    # Find customer by phone
    # --------------------------

    customer = db.query(
        Customer
    ).filter(
        Customer.phone_number == invoice_data.phone_number,
        Customer.user_id == user.id
    ).first()

    # --------------------------
    # Create customer if not found
    # --------------------------

    if not customer:
        customer = Customer(
            customer_name=invoice_data.customer_name,
            phone_number=invoice_data.phone_number,
            user_id=user.id
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

    # --------------------------
    # Create invoice
    # --------------------------

    total_amount = 0
    invoice = Invoice(
        customer_id=customer.customer_id,
        total_amount=0,
        user_id=user.id
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    # --------------------------
    # Process medicines
    # --------------------------

    for item in invoice_data.items:
        batch = db.query(
            InventoryBatch
        ).filter(
            InventoryBatch.medicine_id == item.medicine_id,
            InventoryBatch.user_id == user.id
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
        medicine = db.query(Medicine).filter(
            Medicine.medicine_id == item.medicine_id
        ).first()
        medicine.quantity -= item.quantity
        total_amount += subtotal
    invoice.total_amount = total_amount
    db.commit()
    return {
        "invoice_id": invoice.invoice_id,
        "customer_name": customer.customer_name,
        "phone_number": customer.phone_number,
        "total_amount": total_amount
    }

@router.get("/medicine-prices")
def get_medicine_prices(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()
    batches = db.query(
        InventoryBatch
    ).filter(
        InventoryBatch.user_id == user.id
    ).all()
    return [
        {
            "medicine_id": b.medicine_id,
            "selling_price": b.selling_price
        }
        for b in batches
    ]