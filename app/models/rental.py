"""
Модель оренди велосипеда SQLAlchemy
"""
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Rental(Base):
    """Запис про оренду велосипеда"""
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bicycle_id = Column(Integer, ForeignKey("bicycles.id"), nullable=False)
    hours = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)  # card / cash / apple_pay / google_pay
    status = Column(String, default="active")        # active / completed / cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="rentals")
    bicycle = relationship("Bicycle", back_populates="rentals")
