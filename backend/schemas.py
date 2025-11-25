# backend/schemas.py
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime


class AlgorithmInfo(BaseModel):
    name: str
    label: str
    best: str
    average: str
    worst: str
    space: str
    description: str


class RunRequest(BaseModel):
    algorithm: str
    size: int = Field(ge=2, le=5000)
    distribution: str
    array: Optional[List[int]] = None
    record_steps: bool = True


class Metrics(BaseModel):
    algorithm: str
    n: int
    distribution: str
    runtime_ms: float
    comparisons: int
    swaps: int


class RunResponse(BaseModel):
    sorted: List[int]
    metrics: Metrics
    steps: List[List[int]]


class RunRecord(BaseModel):
    id: int
    algorithm: str
    n: int
    distribution: str
    runtime_ms: float
    comparisons: int
    swaps: int
    created_at: datetime

    class Config:
        from_attributes = True


class PredictRequest(BaseModel):
    algorithm: str
    n: int = Field(ge=2, le=100000)
    distribution: str


class PredictResponse(BaseModel):
    predicted_class: str
    class_probabilities: Dict[str, float]
    predicted_runtime_ms: float


class TrainResponse(BaseModel):
    status: str
    trained_on_samples: int
    accuracy: float
    runtime_mae_ms: float
