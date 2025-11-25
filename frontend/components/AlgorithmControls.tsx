// frontend/components/AlgorithmControls.tsx
"use client";

import { Button, Slider, MenuItem, TextField } from "@mui/material";

export type AlgorithmOption = {
    name: string;
    label: string;
    best: string;
    average: string;
    worst: string;
    space: string;
    description: string;
};

type Props = {
    algorithms: AlgorithmOption[];
    selectedAlgo: string;
    setSelectedAlgo: (v: string) => void;
    arraySize: number;
    setArraySize: (v: number) => void;
    distribution: string;
    setDistribution: (v: string) => void;
    speed: number;
    setSpeed: (v: number) => void;
    onRun: () => void;
    isPlaying: boolean;
    setIsPlaying: (v: boolean) => void;
};

const distributions = [
    { value: "random", label: "Random" },
    { value: "sorted", label: "Sorted" },
    { value: "reverse", label: "Reverse sorted" },
    { value: "nearly_sorted", label: "Nearly sorted" },
    { value: "many_duplicates", label: "Many duplicates" }
];

export default function AlgorithmControls(props: Props) {
    const {
        algorithms,
        selectedAlgo,
        setSelectedAlgo,
        arraySize,
        setArraySize,
        distribution,
        setDistribution,
        speed,
        setSpeed,
        onRun,
        isPlaying,
        setIsPlaying
    } = props;

    const current = algorithms.find(a => a.name === selectedAlgo);

    return (
        <div className="text-xs text-slate-400 mb-1">
            <div className="flex flex-wrap gap-4 items-center">
                <TextField
                    select
                    size="small"
                    label="Algorithm"
                    value={selectedAlgo}
                    onChange={e => setSelectedAlgo(e.target.value)}
                    className="min-w-[180px]"
                >
                    {algorithms.map(a => (
                        <MenuItem key={a.name} value={a.name}>
                            {a.label}
                        </MenuItem>
                    ))}
                </TextField>

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

                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 mb-1">Array size: {arraySize}</span>
                    <Slider
                        size="small"
                        min={10}
                        max={200}
                        value={arraySize}
                        onChange={(_, val) => setArraySize(val as number)}
                        sx={{ width: 180 }}
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 mb-1">Animation speed</span>
                    <Slider
                        size="small"
                        min={10}
                        max={100}
                        value={speed}
                        onChange={(_, val) => setSpeed(val as number)}
                        sx={{ width: 180 }}
                    />
                </div>

                <div className="flex gap-2 ml-auto">
                    <Button variant="contained" color="primary" onClick={onRun}>
                        Run
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={!current}
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </Button>
                </div>
            </div>

            {current && (
                <div className="text-xs text-slate-300">
                    <p className="font-semibold">
                        {current.label} – Best: {current.best}, Avg: {current.average}, Worst: {current.worst}, Space:{" "}
                        {current.space}
                    </p>
                    <p className="text-slate-400 mt-1">{current.description}</p>
                </div>
            )}
        </div>
    );
}
