// frontend/theme.ts
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#38bdf8" // sky-400ish
        },
        secondary: {
            main: "#f472b6" // pink-400ish
        },
        background: {
            default: "#020617", // slate-950
            paper: "#020617"
        },
        text: {
            primary: "#e5e7eb", // slate-200
            secondary: "#9ca3af" // gray-400
        }
    }
});
