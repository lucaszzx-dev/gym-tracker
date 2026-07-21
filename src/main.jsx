import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import { WorkoutProvider } from "./contexts/WorkoutContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import { WeightProvider } from "./contexts/WeightContext";
import { GoalProvider } from "./contexts/GoalContext";

import "./index.css";
import "./styles/theme.css";

import App from "./App.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>

                <ThemeProvider>

                    <UserProvider>

                        <WorkoutProvider>

                            <HistoryProvider>

                                <WeightProvider>

                                    <GoalProvider>

                                        <ErrorBoundary>
                                            <App />
                                        </ErrorBoundary>

                                    </GoalProvider>

                                </WeightProvider>

                            </HistoryProvider>

                        </WorkoutProvider>

                    </UserProvider>

                </ThemeProvider>

            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
