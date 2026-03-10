"""
Модель запчастини — ВелоХаус
"""
from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class SparePart(Base):
    """Запчастина для ремонту велосипеда"""
    __tablename__ = "spare_parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    article = Column(String, nullable=True, index=True)
    manufacturer = Column(String, nullable=True)
    material = Column(String, nullable=True)
    category = Column(String, nullable=True)
    purchase_price = Column(Float, nullable=False, default=0.0)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repairs = relationship(
        "Repair",
        secondary="repair_spare_parts",
        back_populates="spare_parts",
    )
