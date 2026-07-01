from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.database.database import Base


class InventoryBatch(Base):

    __tablename__ = "inventory_batches"

    batch_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    medicine_id = Column(
        Integer,
        ForeignKey("medicines.medicine_id")
    )

    distributor_id = Column(
        Integer,
        ForeignKey("distributors.distributor_id")
    )

    batch_number = Column(
        String,
        nullable=False
    )

    manufacturing_date = Column(
        Date
    )

    expiry_date = Column(
        Date
    )

    stock_entry_date = Column(
        Date
    )

    cost_price = Column(
        Float
    )

    selling_price = Column(
        Float
    )

    quantity = Column(
        Integer
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )