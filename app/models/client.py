"""
Модель клієнта — ВелоХаус
"""
from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Client(Base):
    """Клієнт велопрокату"""
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True, index=True)
    birth_date = Column(Date, nullable=True)
    registration_place = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    rentals = relationship("Rental", back_populates="client")
