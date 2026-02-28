"""
Модель велосипеда SQLAlchemy
"""
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Bicycle(Base):
    """Модель велосипеда в базі даних"""
    __tablename__ = "bicycles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    brand = Column(String, nullable=False, index=True)
    model = Column(String, nullable=False)
    type = Column(String, nullable=False)          # mountain / city / road / bmx / electric / gravel
    price_per_hour = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    image_url = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="bicycles")
    rentals = relationship("Rental", back_populates="bicycle")
