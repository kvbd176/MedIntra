from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.medicine import Medicine
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.inventory_batch import InventoryBatch
from datetime import date, timedelta

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    total_medicines = db.query(
        Medicine
    ).filter(
        Medicine.user_id == user.id
    ).count()

    total_customers = db.query(
        Customer
    ).filter(
        Customer.user_id == user.id
    ).count()

    total_invoices = db.query(
        Invoice
    ).filter(
        Invoice.user_id == user.id
    ).count()

    return {
        "total_medicines": total_medicines,
        "total_customers": total_customers,
        "total_invoices": total_invoices
    }

@router.get("/inventory-value")
def inventory_value(
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

    total_value = 0

    for batch in batches:

        total_value += (
            batch.quantity *
            batch.selling_price
        )

    return {
        "inventory_value": total_value
    }

#low stock alert
@router.get("/low-stock")
def low_stock(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    batches = db.query(
        InventoryBatch
    ).filter(
        InventoryBatch.user_id == user.id,
        InventoryBatch.quantity <= 10
    ).all()

    result = []

    for batch in batches:

        medicine = db.query(
            Medicine
        ).filter(
            Medicine.medicine_id ==
            batch.medicine_id
        ).first()

        result.append({
            "medicine_name":
            medicine.medicine_name,

            "batch_number":
            batch.batch_number,

            "quantity":
            batch.quantity
        })

    return result

#expiring medicine
@router.get("/expiring")
def expiring_medicines(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    limit_date = date.today() + timedelta(days=30)

    batches = db.query(
    InventoryBatch
    ).filter(
        InventoryBatch.user_id == user.id,
        InventoryBatch.expiry_date >= date.today(),
        InventoryBatch.expiry_date <= limit_date
    ).all()

    result = []

    for batch in batches:

        medicine = db.query(
            Medicine
        ).filter(
            Medicine.medicine_id ==
            batch.medicine_id
        ).first()

        result.append({
            "medicine_name":
            medicine.medicine_name,

            "batch_number":
            batch.batch_number,

            "expiry_date":
            batch.expiry_date,

            "days_left":
            (batch.expiry_date - date.today()).days
        })

    return result

@router.get("/sales")
def total_sales(
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

    total_sales = sum(
        invoice.total_amount
        for invoice in invoices
    )

    return {
        "total_sales": total_sales
    }