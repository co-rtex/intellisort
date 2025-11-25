# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base


class AlgorithmRun(Base):
    __tablename__ = "algorithm_runs"

    id = Column(Integer, primary_key=True, index=True)
    algorithm_name = Column(String, index=True, nullable=False)
    n = Column(Integer, nullable=False)
    distribution = Column(String, nullable=False)
    runtime_ms = Column(Float, nullable=False)
    comparisons = Column(Integer, nullable=False)
    swaps = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
