// frontend/components/AppThemeProvider.tsx
"use client";

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import { darkTheme } from "../theme";

type Props = {
    children: ReactNode;
};

export default function AppThemeProvider({ children }: Props) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Navbar />
                <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
