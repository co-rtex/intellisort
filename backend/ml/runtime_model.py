from __future__ import annotations

from typing import Dict, Tuple, Optional, List
import math
import os
import pickle

import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error

# --- Constants -----------------------------------------------------------------

ALGORITHMS: List[str] = [
    "Bubble Sort",
    "Insertion Sort",
    "Selection Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
]

DISTRIBUTIONS: List[str] = [
    "Random",
    "Sorted",
    "Reverse",
    "Nearly sorted",
    "Many duplicates",
]

# Index -> human-readable label
CLASS_LABELS: List[str] = [
    "O(n)",        # 0
    "O(n log n)",  # 1
    "O(n^2)",      # 2
]

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models_store")
CLASSIFIER_PATH = os.path.join(MODELS_DIR, "runtime_classifier.pkl")
REGRESSOR_PATH = os.path.join(MODELS_DIR, "runtime_regressor.pkl")

_classifier: Optional[RandomForestClassifier] = None
_regressor: Optional[RandomForestRegressor] = None


# --- Helpers -------------------------------------------------------------------

def load_models_if_available(*args, **kwargs) -> bool:
    """
    No-op loader for now.

    This function exists so backend.main can import it without crashing.
    It simply returns whether models are already loaded in memory.
    """
    global _classifier, _regressor
    return _classifier is not None and _regressor is not None


def _algo_index(name: str) -> int:
    try:
        return ALGORITHMS.index(name)
    except ValueError:
        return 0


def _dist_index(name: str) -> int:
    try:
        return DISTRIBUTIONS.index(name)
    except ValueError:
        return 0


def _complexity_index(algo: str) -> int:
    """
    Map algorithm name -> complexity class index.
    Bubble/Insertion/Selection -> O(n^2)
    Merge/Quick/Heap -> O(n log n)
    (We currently don't use O(n) but keep it as class 0 for future.)
    """
    if algo in ("Bubble Sort", "Insertion Sort", "Selection Sort"):
        return 2  # O(n^2)
    if algo in ("Merge Sort", "Quick Sort", "Heap Sort"):
        return 1  # O(n log n)
    return 1


def _generate_synthetic_data(
    n_sizes: List[int] | None = None, samples_per_combo: int = 5
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Generate synthetic training data.
    X columns: [algo_idx, dist_idx, n, log2(n), n^2]
    y_class: complexity class index (0,1,2)
    y_runtime: "ms" with noise around theoretical curve.
    """
    if n_sizes is None:
        n_sizes = [10, 20, 40, 80, 160, 320, 640, 1280, 2000]

    rows: List[List[float]] = []
    class_labels: List[int] = []
    runtimes: List[float] = []

    rng = np.random.default_rng(42)

    for algo in ALGORITHMS:
        algo_idx = _algo_index(algo)
        comp_idx = _complexity_index(algo)

        for dist in DISTRIBUTIONS:
            dist_idx = _dist_index(dist)

            for n in n_sizes:
                for _ in range(samples_per_combo):
                    logn = math.log2(n)
                    n2 = n * n

                    # base runtime shape by complexity
                    if comp_idx == 2:  # O(n^2)
                        base = 1e-4 * n2
                    elif comp_idx == 1:  # O(n log n)
                        base = 5e-3 * n * logn
                    else:  # O(n)
                        base = 1e-2 * n

                    # distribution tweaks
                    if dist == "Sorted":
                        base *= 0.6
                    elif dist == "Reverse":
                        base *= 1.3
                    elif dist == "Nearly sorted":
                        base *= 0.8
                    elif dist == "Many duplicates":
                        base *= 0.9

                    noise = rng.normal(loc=0.0, scale=0.15 * base)
                    runtime_ms = max(base + noise, 0.01)

                    rows.append([algo_idx, dist_idx, n, logn, n2])
                    class_labels.append(comp_idx)
                    runtimes.append(runtime_ms)

    X = np.asarray(rows, dtype=float)
    y_class = np.asarray(class_labels, dtype=int)
    y_runtime = np.asarray(runtimes, dtype=float)
    return X, y_class, y_runtime


# --- Training / Persistence -----------------------------------------------------


def train_models() -> Dict[str, float]:
    """
    Train classifier + regressor on synthetic data.
    Saves both models to disk and keeps them in memory.
    """
    global _classifier, _regressor

    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR, exist_ok=True)

    X, y_class, y_runtime = _generate_synthetic_data()

    (
        X_train,
        X_test,
        y_class_train,
        y_class_test,
        y_runtime_train,
        y_runtime_test,
    ) = train_test_split(
        X, y_class, y_runtime, test_size=0.25, random_state=42, shuffle=True
    )

    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=None,
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_class_train)

    reg = RandomForestRegressor(
        n_estimators=120,
        max_depth=None,
        random_state=42,
        n_jobs=-1,
    )
    reg.fit(X_train, y_runtime_train)

    y_class_pred = clf.predict(X_test)
    y_rt_pred = reg.predict(X_test)

    acc = float(accuracy_score(y_class_test, y_class_pred))
    mae = float(mean_absolute_error(y_runtime_test, y_rt_pred))

    # Compute RMSE in a way that works with any sklearn version
    mse = float(mean_squared_error(y_runtime_test, y_rt_pred))
    rmse = math.sqrt(mse)

    # persist
    with open(CLASSIFIER_PATH, "wb") as f:
        pickle.dump(clf, f)
    with open(REGRESSOR_PATH, "wb") as f:
        pickle.dump(reg, f)

    _classifier = clf
    _regressor = reg

    return {
        "status": "ok",
        "trained_on_samples": int(X.shape[0]),
        "accuracy": acc,
        "runtime_mae_ms": mae,
        "runtime_rmse_ms": rmse,
    }


def load_models() -> None:
    """
    Load models from disk if available.
    """
    global _classifier, _regressor

    if os.path.exists(CLASSIFIER_PATH) and os.path.exists(REGRESSOR_PATH):
        try:
            with open(CLASSIFIER_PATH, "rb") as f:
                _classifier = pickle.load(f)
            with open(REGRESSOR_PATH, "rb") as f:
                _regressor = pickle.load(f)
        except Exception:
            # If loading fails, reset to None; caller can retrain.
            _classifier = None
            _regressor = None


# --- Prediction -----------------------------------------------------------------


def predict(
    algorithm: str,
    n: int,
    distribution: str,
) -> Tuple[str, Dict[str, float], float]:
    """
    Predict complexity class & runtime.

    Handles the case where the classifier has only a subset of CLASS_LABELS
    by using classifier.classes_ instead of assuming all 3 are present.
    """
    global _classifier, _regressor

    if _classifier is None or _regressor is None:
        raise RuntimeError("Models are not trained yet.")

    algo_idx = _algo_index(algorithm)
    dist_idx = _dist_index(distribution)
    logn = math.log2(n)
    n2 = n * n

    X = np.array([[algo_idx, dist_idx, n, logn, n2]], dtype=float)

    # class prediction
    class_idx = int(_classifier.predict(X)[0])

    # probs_raw aligned with _classifier.classes_
    probs_raw = _classifier.predict_proba(X)[0]
    probs: Dict[str, float] = {label: 0.0 for label in CLASS_LABELS}

    for class_value, prob in zip(_classifier.classes_, probs_raw):
        label = CLASS_LABELS[int(class_value)]
        probs[label] = float(prob)

    runtime_ms = float(_regressor.predict(X)[0])
    predicted_label = CLASS_LABELS[class_idx]

    return predicted_label, probs, runtime_ms
