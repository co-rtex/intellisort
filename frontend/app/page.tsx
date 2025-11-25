// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import AlgorithmControls, { AlgorithmOption } from "../components/AlgorithmControls";
import SortVisualizer from "../components/SortVisualizer";
import ComparisonView from "../components/ComparisonView";
import MetricsPanel from "../components/MetricsPanel";
import { getAlgorithms, runAlgorithm, RunResult } from "../lib/api";

export default function HomePage() {
    const [algorithms, setAlgorithms] = useState<AlgorithmOption[]>([]);
    const [selectedAlgo, setSelectedAlgo] = useState<string>("quick_sort");
    const [arraySize, setArraySize] = useState<number>(40);
    const [distribution, setDistribution] = useState<string>("random");
    const [speed, setSpeed] = useState<number>(40);
    const [runResult, setRunResult] = useState<RunResult | null>(null);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        getAlgorithms().then(setAlgorithms).catch(console.error);
    }, []);

    useEffect(() => {
        if (!runResult || !isPlaying) return;
        const steps = runResult.steps.length;
        const delay = 4000 / speed; // ms per step
        const id = setInterval(() => {
            setActiveStep(prev => {
                if (prev + 1 >= steps) {
                    setIsPlaying(false);
                    return steps - 1;
                }
                return prev + 1;
            });
        }, delay);
        return () => clearInterval(id);
    }, [runResult, isPlaying, speed]);

    const handleRun = async () => {
        try {
            const res = await runAlgorithm({
                algorithm: selectedAlgo,
                size: arraySize,
                distribution,
                record_steps: true
            });
            setRunResult(res);
            setActiveStep(0);
            setIsPlaying(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    IntelliSort <span className="text-sky-400">Visualizer</span>
                </h1>
                <p className="text-slate-300 max-w-2xl">
                    Watch classic sorting algorithms in action, compare them side-by-side, and explore how an AI model
                    learns to recognize time-complexity patterns from runtime data.
                </p>
            </section>

            <AlgorithmControls
                algorithms={algorithms}
                selectedAlgo={selectedAlgo}
                setSelectedAlgo={setSelectedAlgo}
                arraySize={arraySize}
                setArraySize={setArraySize}
                distribution={distribution}
                setDistribution={setDistribution}
                speed={speed}
                setSpeed={setSpeed}
                onRun={handleRun}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                    <h2 className="font-semibold mb-2">Algorithm Animation</h2>
                    <div className="h-64">
                        <SortVisualizer
                            array={runResult ? runResult.steps[activeStep] : []}
                        />
                    </div>
                </div>
                <div>
                    <MetricsPanel metrics={runResult?.metrics || null} selectedAlgo={selectedAlgo} algorithms={algorithms} />
                </div>
            </div>

            <ComparisonView algorithms={algorithms} distribution={distribution} arraySize={arraySize} />

            <section className="mt-6 text-sm text-slate-400">
                <h3 className="font-semibold text-slate-200 mb-2">How to read the visualization</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Each bar represents an array element; height corresponds to its value.</li>
                    <li>The animation shows how the algorithm rearranges the bars into sorted order.</li>
                    <li>
                        Use the comparison section to see which algorithm wins on time and operation counts for a specific
                        input size and distribution.
                    </li>
                </ul>
            </section>
        </div>
    );
}
