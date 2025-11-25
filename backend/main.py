# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from .database import Base, engine, get_db
from .models import AlgorithmRun
from .sorting.algorithms import SUPPORTED_ALGORITHMS, DISTRIBUTIONS, generate_array, run_sort
from .schemas import (
    AlgorithmInfo,
    RunRequest,
    RunResponse,
    RunRecord,
    Metrics,
    PredictRequest,
    PredictResponse,
    TrainResponse,
)
from .ml.runtime_model import load_models_if_available, train_models, predict

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IntelliSort API", version="0.1.0")

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models if present
load_models_if_available()


@app.get("/api/algorithms", response_model=List[AlgorithmInfo])
def get_algorithms():
    res = []
    for name, meta in SUPPORTED_ALGORITHMS.items():
        res.append(
            AlgorithmInfo(
                name=name,
                label=meta["label"],
                best=meta["best"],
                average=meta["average"],
                worst=meta["worst"],
                space=meta["space"],
                description=meta["description"],
            )
        )
    return res


@app.post("/api/run", response_model=RunResponse)
def run_algorithm(req: RunRequest, db: Session = Depends(get_db)):
    if req.algorithm not in SUPPORTED_ALGORITHMS:
        raise HTTPException(status_code=400, detail="Unsupported algorithm")
    if req.distribution not in DISTRIBUTIONS and req.array is None:
        raise HTTPException(status_code=400, detail="Unsupported distribution")

    if req.array is not None:
        arr = req.array
    else:
        arr = generate_array(req.size, req.distribution)

    sorted_arr, comps, swaps, runtime_ms, steps = run_sort(
        req.algorithm, arr, req.record_steps)

    run = AlgorithmRun(
        algorithm_name=req.algorithm,
        n=len(arr),
        distribution=req.distribution,
        runtime_ms=runtime_ms,
        comparisons=comps,
        swaps=swaps,
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    metrics = Metrics(
        algorithm=req.algorithm,
        n=len(arr),
        distribution=req.distribution,
        runtime_ms=runtime_ms,
        comparisons=comps,
        swaps=swaps,
    )
    return RunResponse(sorted=sorted_arr, metrics=metrics, steps=steps)


@app.get("/api/runs", response_model=List[RunRecord])
def list_runs(
    db: Session = Depends(get_db),
    algorithm: Optional[str] = None,
    min_n: Optional[int] = None,
    max_n: Optional[int] = None,
    limit: int = 100,
):
    q = db.query(AlgorithmRun)
    if algorithm:
        q = q.filter(AlgorithmRun.algorithm_name == algorithm)
    if min_n is not None:
        q = q.filter(AlgorithmRun.n >= min_n)
    if max_n is not None:
        q = q.filter(AlgorithmRun.n <= max_n)
    q = q.order_by(AlgorithmRun.created_at.desc()).limit(limit)
    runs = q.all()
    return [
        RunRecord(
            id=r.id,
            algorithm=r.algorithm_name,
            n=r.n,
            distribution=r.distribution,
            runtime_ms=r.runtime_ms,
            comparisons=r.comparisons,
            swaps=r.swaps,
            created_at=r.created_at,
        )
        for r in runs
    ]


@app.post("/api/predict", response_model=PredictResponse)
def predict_runtime(req: PredictRequest):
    try:
        predicted_class, class_probs, runtime_ms = predict(
            req.algorithm, req.n, req.distribution)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return PredictResponse(
        predicted_class=predicted_class,
        class_probabilities=class_probs,
        predicted_runtime_ms=runtime_ms,
    )


@app.post("/api/train", response_model=TrainResponse)
def train_endpoint():
    """
    Train the ML models on synthetic data and return metrics.
    Note: training is fully synthetic and does not use the DB.
    """
    result = train_models()  # returns a dict

    # result has keys: "status", "trained_on_samples", "accuracy", "runtime_mae_ms"
    return TrainResponse(**result)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)


@app.get("/")
def root():
    return {"message": "IntelliSort backend running"}
