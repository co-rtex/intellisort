// frontend/lib/api.ts
export type AlgorithmInfo = {
    name: string;
    label: string;
    best: string;
    average: string;
    worst: string;
    space: string;
    description: string;
};

export type AlgorithmOption = AlgorithmInfo;

export type RunMetrics = {
    algorithm: string;
    n: number;
    distribution: string;
    runtime_ms: number;
    comparisons: number;
    swaps: number;
};

export type RunResult = {
    sorted: number[];
    metrics: RunMetrics;
    steps: number[][];
};

export type RunRecord = {
    id: number;
    algorithm: string;
    n: number;
    distribution: string;
    runtime_ms: number;
    comparisons: number;
    swaps: number;
    created_at: string;
};

export type PredictResult = {
    predicted_class: string;
    class_probabilities: Record<string, number>;
    predicted_runtime_ms: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getAlgorithms(): Promise<AlgorithmInfo[]> {
    const res = await fetch(`${API_URL}/api/algorithms`);
    if (!res.ok) throw new Error("Failed to fetch algorithms");
    return res.json();
}

export async function runAlgorithm(req: {
    algorithm: string;
    size: number;
    distribution: string;
    record_steps: boolean;
}): Promise<RunResult> {
    const res = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error("Failed to run algorithm");
    return res.json();
}

export async function getRuns(algorithm?: string): Promise<RunRecord[]> {
    const url = new URL(`${API_URL}/api/runs`);
    if (algorithm) url.searchParams.set("algorithm", algorithm);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch runs");
    return res.json();
}

export async function predictRuntime(req: {
    algorithm: string;
    n: number;
    distribution: string;
}): Promise<PredictResult> {
    const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error("Failed to predict runtime");
    return res.json();
}
