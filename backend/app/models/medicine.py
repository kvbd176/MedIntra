from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.database.database import Base


class Medicine(Base):
    __tablename__ = "medicines"
    medicine_id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    medicine_name = Column(
        String,
        nullable=False
    )
    quantity = Column(
        Integer, 
        default=0
    )

    manufacturer = Column(
        String,
        nullable=False
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
    user_id = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=False
    )