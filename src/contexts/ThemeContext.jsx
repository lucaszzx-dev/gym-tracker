import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const STORAGE_KEY = "gym-tracker-theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return (
            localStorage.getItem(
                STORAGE_KEY
            ) || "dark"
        );
    });

    useEffect(() => {
        document.body.dataset.theme = theme;

        localStorage.setItem(
            STORAGE_KEY,
            theme
        );
    }, [theme]);

    function toggleTheme() {
        setTheme((currentTheme) =>
            currentTheme === "dark"
                ? "light"
                : "dark"
        );
    }

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(
        ThemeContext
    );

    if (!context) {
        throw new Error(
            "useTheme deve ser usado dentro de ThemeProvider."
        );
    }

    return context;
}