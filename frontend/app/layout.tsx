// frontend/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import AppThemeProvider from "../components/AppThemeProvider";

export const metadata = {
    title: "IntelliSort",
    description: "Algorithm Visualization + AI Runtime Prediction",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-slate-950 text-slate-100">
                <AppThemeProvider>{children}</AppThemeProvider>
            </body>
        </html>
    );
}
