// frontend/app/predict/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAlgorithms, predictRuntime } from "../../lib/api";
import { AlgorithmOption } from "../../components/AlgorithmControls";
import PredictorForm from "../../components/PredictorForm";
import PredictionResult from "../../components/PredictionResult";

export default function PredictPage() {
    const [algorithms, setAlgorithms] = useState<AlgorithmOption[]>([]);
    const [result, setResult] = useState<ReturnType<typeof predictRuntime> extends Promise<infer R> ? R | null : null>(null);

    useEffect(() => {
        getAlgorithms().then(setAlgorithms).catch(console.error);
    }, []);

    const handlePredict = async (algorithm: string, n: number, distribution: string) => {
        const res = await predictRuntime({ algorithm, n, distribution });
        setResult(res);
    };

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    AI Runtime <span className="text-emerald-400">Prediction</span>
                </h1>
                <p className="text-slate-300 max-w-2xl">
                    This model learns from empirical runtime data and synthetic examples to classify algorithms into
                    complexity classes and predict runtime for a given input size.
                </p>
            </section>

            <PredictorForm algorithms={algorithms} onPredict={handlePredict} />

            <PredictionResult result={result} />
        </div>
    );
}
