"""
Модель аксесуара — ВелоХаус
"""
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

# Таблиця зв'язку «велосипед — аксесуари» (M:M)
bicycle_accessories = Table(
    "bicycle_accessories",
    Base.metadata,
    Column("bicycle_id", Integer, ForeignKey("bicycles.id", ondelete="CASCADE"), primary_key=True),
    Column("accessory_id", Integer, ForeignKey("accessories.id", ondelete="CASCADE"), primary_key=True),
)


class Accessory(Base):
    """Аксесуар для велосипеда"""
    __tablename__ = "accessories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    country = Column(String, nullable=True)
    warranty_months = Column(Integer, nullable=True, default=0)
    sale_price = Column(Float, nullable=False, default=0.0)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bicycles = relationship(
        "Bicycle",
        secondary="bicycle_accessories",
        back_populates="accessories",
    )
