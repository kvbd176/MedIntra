from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import ForeignKey

from app.database.database import Base


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    item_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    invoice_id = Column(
        Integer,
        ForeignKey("invoices.invoice_id")
    )

    medicine_id = Column(
        Integer,
        ForeignKey("medicines.medicine_id")
    )

    quantity = Column(
        Integer
    )

    unit_price = Column(
        Float
    )

    subtotal = Column(
        Float
    )