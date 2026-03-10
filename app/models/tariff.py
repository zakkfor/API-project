"""
Модель тарифу оренди — ВелоХаус
"""
from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Tariff(Base):
    """Тариф оренди велосипеда"""
    __tablename__ = "tariffs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    deposit = Column(Float, nullable=False, default=0.0)
    price_per_day = Column(Float, nullable=False)
    price_per_hour = Column(Float, nullable=False)
    rental_point = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    rentals = relationship("Rental", back_populates="tariff")
