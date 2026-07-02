from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.database.database import Base


class Invoice(Base):
    __tablename__ = "invoices"
    invoice_id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    customer_id = Column(
        Integer,
        ForeignKey("customers.customer_id")
    )
    total_amount = Column(
        Float,
        default=0
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    user_id = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=False
    )