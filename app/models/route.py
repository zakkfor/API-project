"""
Модель маршруту — ВелоХаус
"""
from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Route(Base):
    """Маршрут для велопрогулянки"""
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    map_url = Column(String, nullable=True)
    length_km = Column(Float, nullable=True)
    # easy / medium / hard / extreme
    difficulty = Column(String, nullable=False, default="easy")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    rentals = relationship("Rental", back_populates="route")
