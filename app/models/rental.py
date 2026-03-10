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
    tariff_id = Column(Integer, ForeignKey("tariffs.id"), nullable=True)   # тариф
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)   # клієнт
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)     # маршрут
    hours = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)  # card / cash / apple_pay / google_pay
    status = Column(String, default="active")        # active / completed / cancelled
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="rentals")
    bicycle = relationship("Bicycle", back_populates="rentals")
    tariff = relationship("Tariff", back_populates="rentals")
    client = relationship("Client", back_populates="rentals")
    route = relationship("Route", back_populates="rentals")
