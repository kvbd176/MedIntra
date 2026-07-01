from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database.database import Base


class Distributor(Base):

    __tablename__ = "distributors"

    distributor_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    distributor_name = Column(
        String,
        nullable=False
    )

    phone = Column(
        String
    )

    email = Column(
        String
    )

    address = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )