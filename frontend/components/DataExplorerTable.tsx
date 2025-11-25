// frontend/components/DataExplorerTable.tsx
"use client";

import { AlgorithmOption } from "./AlgorithmControls";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

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

type Props = {
    algorithms: AlgorithmOption[];
    runs: RunRecord[];
    selectedAlgo: string | "all";
    setSelectedAlgo: (v: string | "all") => void;
};

export default function DataExplorerTable({ algorithms, runs, selectedAlgo, setSelectedAlgo }: Props) {
    const chartRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        if (!runs.length) return;
        const width = 500;
        const height = 200;
        const margin = { top: 10, right: 10, bottom: 30, left: 40 };

        const x = d3
            .scaleLinear()
            .domain([d3.min(runs, d => d.n) || 0, d3.max(runs, d => d.n) || 1])
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(runs, d => d.runtime_ms) || 1])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal(d3.schemeTableau10);

        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("~s") as any))
            .selectAll("text")
            .style("font-size", "10px");

        svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(4))
            .selectAll("text")
            .style("font-size", "10px");

        svg
            .selectAll("circle")
            .data(runs)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.n))
            .attr("cy", d => y(d.runtime_ms))
            .attr("r", 3)
            .attr("fill", d => color(d.algorithm));
    }, [runs]);

    const algoLabel = (name: string) => algorithms.find(a => a.name === name)?.label || name;

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Filter by algorithm:</span>
                        <select
                            value={selectedAlgo}
                            onChange={e => setSelectedAlgo(e.target.value as any)}
                            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
                        >
                            <option value="all">All</option>
                            {algorithms.map(a => (
                                <option key={a.name} value={a.name}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <span className="text-xs text-slate-500">{runs.length} runs shown</span>
                </div>
                <svg ref={chartRef} width={500} height={200} />
                <p className="text-[11px] text-slate-500 mt-1">
                    Scatter plot of runtime (ms) vs input size (n). Each color represents a different algorithm.
                </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900/70 max-h-72 overflow-auto">
                <table className="min-w-full text-xs">
                    <thead className="bg-slate-900 border-b border-slate-700 sticky top-0">
                        <tr className="text-left">
                            <th className="px-2 py-1">Algorithm</th>
                            <th className="px-2 py-1">n</th>
                            <th className="px-2 py-1">Dist</th>
                            <th className="px-2 py-1">Runtime (ms)</th>
                            <th className="px-2 py-1">Comparisons</th>
                            <th className="px-2 py-1">Swaps</th>
                            <th className="px-2 py-1">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {runs.map(r => (
                            <tr key={r.id} className="border-b border-slate-800 hover:bg-slate-800/60">
                                <td className="px-2 py-1">{algoLabel(r.algorithm)}</td>
                                <td className="px-2 py-1">{r.n}</td>
                                <td className="px-2 py-1">{r.distribution}</td>
                                <td className="px-2 py-1">{r.runtime_ms.toFixed(3)}</td>
                                <td className="px-2 py-1">{r.comparisons}</td>
                                <td className="px-2 py-1">{r.swaps}</td>
                                <td className="px-2 py-1 text-slate-500">
                                    {new Date(r.created_at).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                        {!runs.length && (
                            <tr>
                                <td colSpan={7} className="px-2 py-4 text-center text-slate-500">
                                    No runs yet. Go back to the Visualizer and run an algorithm.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
