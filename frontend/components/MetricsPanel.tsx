// frontend/components/MetricsPanel.tsx
"use client";

import { AlgorithmOption } from "./AlgorithmControls";

type Metrics = {
    algorithm: string;
    n: number;
    distribution: string;
    runtime_ms: number;
    comparisons: number;
    swaps: number;
} | null;

type Props = {
    metrics: Metrics;
    selectedAlgo: string;
    algorithms: AlgorithmOption[];
};

export default function MetricsPanel({ metrics, selectedAlgo, algorithms }: Props) {
    const algoMeta = algorithms.find(a => a.name === selectedAlgo);
    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-sm space-y-3">
            <h2 className="font-semibold mb-1">Metrics</h2>
            {metrics ? (
                <div className="space-y-1">
                    <p>
                        <span className="text-slate-400">Algorithm:</span> {algoMeta?.label || metrics.algorithm}
                    </p>
                    <p>
                        <span className="text-slate-400">n:</span> {metrics.n} |{" "}
                        <span className="text-slate-400">Distribution:</span> {metrics.distribution}
                    </p>
                    <p>
                        <span className="text-slate-400">Runtime:</span> {metrics.runtime_ms.toFixed(3)} ms
                    </p>
                    <p>
                        <span className="text-slate-400">Comparisons:</span> {metrics.comparisons}
                    </p>
                    <p>
                        <span className="text-slate-400">Swaps/moves:</span> {metrics.swaps}
                    </p>
                </div>
            ) : (
                <p className="text-slate-500 text-sm">Run an algorithm to see runtime metrics.</p>
            )}
            <div className="border-t border-slate-700 pt-2 text-xs text-slate-400">
                <p>
                    Theoretical complexity gives a scaling trend (e.g., O(n²)), but real runtimes depend on constants,
                    data distributions, and implementation details.
                </p>
            </div>
        </div>
    );
}
