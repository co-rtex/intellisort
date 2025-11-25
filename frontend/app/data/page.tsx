// frontend/app/data/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAlgorithms, getRuns, RunRecord } from "../../lib/api";
import { AlgorithmOption } from "../../components/AlgorithmControls";
import DataExplorerTable from "../../components/DataExplorerTable";

export default function DataPage() {
    const [algorithms, setAlgorithms] = useState<AlgorithmOption[]>([]);
    const [runs, setRuns] = useState<RunRecord[]>([]);
    const [selectedAlgo, setSelectedAlgo] = useState<string | "all">("all");

    const fetchRuns = async (algo?: string) => {
        const data = await getRuns(algo && algo !== "all" ? algo : undefined);
        setRuns(data);
    };

    useEffect(() => {
        getAlgorithms().then(setAlgorithms).catch(console.error);
        fetchRuns().catch(console.error);
    }, []);

    useEffect(() => {
        fetchRuns(selectedAlgo && selectedAlgo !== "all" ? selectedAlgo : undefined).catch(console.error);
    }, [selectedAlgo]);

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold tracking-tight">
                    Runtime <span className="text-fuchsia-400">Data Explorer</span>
                </h1>
                <p className="text-slate-300 max-w-2xl mt-2">
                    Every time you run a visualization, IntelliSort logs runtime metrics here. Use this page to explore
                    how algorithms scale with input size and distribution.
                </p>
            </section>

            <DataExplorerTable
                algorithms={algorithms}
                runs={runs}
                selectedAlgo={selectedAlgo}
                setSelectedAlgo={setSelectedAlgo}
            />
        </div>
    );
}
