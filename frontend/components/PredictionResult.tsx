// frontend/components/PredictionResult.tsx
"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type PredictResponse = {
    predicted_class: string;
    class_probabilities: Record<string, number>;
    predicted_runtime_ms: number;
} | null;

type Props = {
    result: PredictResponse;
};

export default function PredictionResult({ result }: Props) {
    const chartRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!result || !chartRef.current) return;

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 180;
        const margin = { top: 10, right: 10, bottom: 25, left: 35 };

        const ns = [100, 200, 400, 800, 1600, 3200];
        const runtimes = ns.map(n => {
            // naive scaling: assume runtime ~ predicted_runtime * (n / n0)^(exponent)
            const baseN = 500;
            const ratio = n / baseN;
            let exponent = 1;
            if (result.predicted_class === "O(n^2)") exponent = 2;
            if (result.predicted_class === "O(n log n)") exponent = 1.2;
            return result.predicted_runtime_ms * Math.pow(ratio, exponent);
        });

        const x = d3.scaleLinear().domain([ns[0], ns[ns.length - 1]]).range([margin.left, width - margin.right]);
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(runtimes) || 1])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3
            .line<number>()
            .x((d, i) => x(ns[i]))
            .y(d => y(d));

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
            .append("path")
            .datum(runtimes)
            .attr("fill", "none")
            .attr("stroke", "#38bdf8")
            .attr("stroke-width", 2)
            .attr("d", line as any);
    }, [result]);

    if (!result) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-400">
                Submit a query to see the AI’s prediction.
            </div>
        );
    }

    const maxLabel = Object.entries(result.class_probabilities).reduce(
        (best, cur) => (cur[1] > best[1] ? cur : best),
        ["", 0]
    );

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 space-y-4 text-sm">
            <div className="flex items-center gap-3">
                <span className="text-slate-400">Predicted complexity:</span>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/40">
                    {result.predicted_class}
                </span>
                <span className="text-slate-500 text-xs">
                    (Confidence: {(maxLabel[1] * 100).toFixed(1)}% for {maxLabel[0]})
                </span>
            </div>

            <p>
                <span className="text-slate-400">Predicted runtime:</span>{" "}
                {result.predicted_runtime_ms.toFixed(3)} ms (for your chosen n)
            </p>

            <div>
                <p className="text-slate-400 mb-1">Runtime scaling (rough projection)</p>
                <svg ref={chartRef} width={400} height={180} />
                <p className="text-[11px] text-slate-500 mt-1">
                    This curve is a simplified projection based on the predicted complexity class. It’s meant as an
                    intuition aid, not a precise performance guarantee.
                </p>
            </div>

            <div className="border-t border-slate-700 pt-2 text-[11px] text-slate-400">
                <p>
                    The model is trained on empirical runs plus synthetic data generated from theoretical complexity
                    formulas. The goal is to see how close the learned behavior is to known Big-O classes.
                </p>
            </div>
        </div>
    );
}
