"""
Модель ремонту велосипеда — ВелоХаус
"""
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

# Таблиця зв'язку «ремонт — запчастини» (M:M)
repair_spare_parts = Table(
    "repair_spare_parts",
    Base.metadata,
    Column("repair_id", Integer, ForeignKey("repairs.id", ondelete="CASCADE"), primary_key=True),
    Column("spare_part_id", Integer, ForeignKey("spare_parts.id", ondelete="CASCADE"), primary_key=True),
    Column("quantity_used", Integer, nullable=False, default=1),
)


class Repair(Base):
    """Запис про ремонт велосипеда"""
    __tablename__ = "repairs"

    id = Column(Integer, primary_key=True, index=True)
    bicycle_id = Column(Integer, ForeignKey("bicycles.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    repair_type = Column(String, nullable=False)
    performer = Column(String, nullable=True)
    warranty_days = Column(Integer, nullable=True, default=0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bicycle = relationship("Bicycle", back_populates="repairs")
    spare_parts = relationship(
        "SparePart",
        secondary="repair_spare_parts",
        back_populates="repairs",
    )
