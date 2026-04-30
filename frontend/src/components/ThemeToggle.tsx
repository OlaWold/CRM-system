import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

const initialTheme = (): Theme => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(initialTheme);
    const isDark = theme === "dark";

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme, isDark]);

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? "Bytt til lys modus" : "Bytt til mørk modus"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isDark ? "bg-primary border-primary" : "bg-muted border-border"
            }`}
        >
            <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-card shadow-sm transition-transform ${
                    isDark ? "translate-x-6" : "translate-x-1"
                }`}
            >
                {isDark ? (
                    <Moon size={12} className="text-foreground" />
                ) : (
                    <Sun size={12} className="text-foreground" />
                )}
            </span>
        </button>
    );
}
