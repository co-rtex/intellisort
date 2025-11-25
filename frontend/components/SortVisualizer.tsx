// frontend/components/SortVisualizer.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
    array: number[];
};

export default function SortVisualizer({ array }: Props) {
    const maxVal = array.length > 0 ? Math.max(...array) : 1;
    return (
        <div className="flex items-end justify-center h-full gap-[2px]">
            {array.map((value, idx) => {
                const heightPercent = (value / maxVal) * 100;
                return (
                    <motion.div
                        key={idx}
                        layout
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className="bg-sky-400 rounded-t-sm"
                        style={{ width: `${100 / Math.max(array.length, 1)}%`, height: `${heightPercent}%` }}
                    />
                );
            })}
        </div>
    );
}
