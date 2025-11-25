// frontend/components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="font-semibold text-lg">
                    Intelli<span className="text-sky-400">Sort</span>
                </Link>
                <div className="flex gap-4 text-sm">
                    <Link href="/" className="hover:text-sky-300">
                        Visualizer
                    </Link>
                    <Link href="/predict" className="hover:text-sky-300">
                        AI Predictor
                    </Link>
                    <Link href="/data" className="hover:text-sky-300">
                        Data Explorer
                    </Link>
                </div>
            </nav>
        </header>
    );
}
