from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.database.database import Base


class Customer(Base):
    __tablename__ = "customers"
    customer_id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    customer_name = Column(
        String,
        nullable=False
    )
    phone_number = Column(
        String,
        unique=True,
        nullable=False
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