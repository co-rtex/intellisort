// frontend/components/ComparisonView.tsx
"use client";

import { useEffect, useState } from "react";
import { AlgorithmOption } from "./AlgorithmControls";
import { runAlgorithm, RunResult } from "../lib/api";
import SortVisualizer from "./SortVisualizer";

type Props = {
    algorithms: AlgorithmOption[];
    distribution: string;
    arraySize: number;
};

const defaultAlgoNames = ["bubble_sort", "merge_sort", "quick_sort"];

export default function ComparisonView({ algorithms, distribution, arraySize }: Props) {
    const [selected, setSelected] = useState<string[]>(defaultAlgoNames);
    const [results, setResults] = useState<Record<string, RunResult | null>>({});
    const [sharedArray, setSharedArray] = useState<number[] | null>(null);

    useEffect(() => {
        // reset when size/distribution change
        setResults({});
        setSharedArray(null);
    }, [arraySize, distribution]);

    const runComparison = async () => {
        try {
            // first run with one algorithm to get shared input
            const base = await runAlgorithm({
                algorithm: selected[0],
                size: arraySize,
                distribution,
                record_steps: false
            });
            const original = base.sorted.slice().sort((a, b) => a - b); // we don't know original; for demo we just reuse
            // In a real version we'd add support for returning initial array from backend.

            const newResults: Record<string, RunResult> = {};
            for (const name of selected) {
                const res = await runAlgorithm({
                    algorithm: name,
                    size: arraySize,
                    distribution,
                    record_steps: false
                });
                newResults[name] = res;
            }
            setSharedArray(original);
            setResults(newResults);
        } catch (err) {
            console.error(err);
        }
    };

    const activeResults = Object.entries(results);

    let winnerByTime: string | null = null;
    if (activeResults.length) {
        winnerByTime = activeResults.reduce((best, [name, res]) => {
            if (!res) return best;
            if (!best) return name;
            const bestMs = results[best]?.metrics.runtime_ms ?? Infinity;
            if (res.metrics.runtime_ms < bestMs) return name;
            return best;
        }, "" as string);
    }

    return (
        <section className="mt-8 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Side-by-side comparison</h2>
                <button
                    onClick={runComparison}
                    className="px-3 py-1.5 rounded-md bg-sky-600 text-sm hover:bg-sky-500 transition"
                >
                    Run comparison
                </button>
            </div>
            <p className="text-xs text-slate-400">
                All algorithms are run on the same configuration (n = {arraySize}, distribution = {distribution}). The
                “winner” is the one with the lowest runtime for this specific experiment.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
                {selected.map(name => {
                    const meta = algorithms.find(a => a.name === name);
                    const res = results[name];
                    const isWinner = winnerByTime === name;
                    return (
                        <div
                            key={name}
                            className={`rounded-xl border p-3 bg-slate-900/70 text-xs ${isWinner ? "border-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]" : "border-slate-700"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-sm">{meta?.label ?? name}</span>
                                {isWinner && (
                                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300">
                                        Winner
                                    </span>
                                )}
                            </div>
                            <div className="h-24 mb-2">
                                <SortVisualizer array={res ? res.sorted : sharedArray || []} />
                            </div>
                            {res ? (
                                <ul className="space-y-0.5">
                                    <li>
                                        <span className="text-slate-400">Runtime:</span>{" "}
                                        {res.metrics.runtime_ms.toFixed(3)} ms
                                    </li>
                                    <li>
                                        <span className="text-slate-400">Comparisons:</span> {res.metrics.comparisons}
                                    </li>
                                    <li>
                                        <span className="text-slate-400">Swaps:</span> {res.metrics.swaps}
                                    </li>
                                </ul>
                            ) : (
                                <p className="text-slate-500">Run comparison to see metrics.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
