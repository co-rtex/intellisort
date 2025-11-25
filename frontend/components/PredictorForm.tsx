// frontend/components/PredictorForm.tsx
"use client";

import { useState } from "react";
import { AlgorithmOption } from "./AlgorithmControls";
import { Button, TextField, MenuItem } from "@mui/material";

type Props = {
    algorithms: AlgorithmOption[];
    onPredict: (algorithm: string, n: number, distribution: string) => void;
};

const distributions = [
    { value: "random", label: "Random" },
    { value: "sorted", label: "Sorted" },
    { value: "reverse", label: "Reverse sorted" },
    { value: "nearly_sorted", label: "Nearly sorted" },
    { value: "many_duplicates", label: "Many duplicates" }
];

export default function PredictorForm({ algorithms, onPredict }: Props) {
    const [algorithm, setAlgorithm] = useState<string>("merge_sort");
    const [n, setN] = useState<number>(500);
    const [distribution, setDistribution] = useState<string>("random");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPredict(algorithm, n, distribution);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 flex flex-wrap gap-4 items-end"
        >
            <TextField
                select
                size="small"
                label="Algorithm"
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value)}
                className="min-w-[200px]"
            >
                {algorithms.map(a => (
                    <MenuItem key={a.name} value={a.name}>
                        {a.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                size="small"
                type="number"
                label="Input size (n)"
                value={n}
                onChange={e => setN(Number(e.target.value))}
                className="min-w-[150px]"
                inputProps={{ min: 2, max: 100000 }}
            />
            <TextField
                select
                size="small"
                label="Distribution"
                value={distribution}
                onChange={e => setDistribution(e.target.value)}
                className="min-w-[180px]"
            >
                {distributions.map(d => (
                    <MenuItem key={d.value} value={d.value}>
                        {d.label}
                    </MenuItem>
                ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary">
                Predict runtime & complexity
            </Button>
        </form>
    );
}
