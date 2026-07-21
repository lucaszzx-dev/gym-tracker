import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuth } from "./contexts/AuthContext";

import Navbar from "./components/layout/Navbar";
import Container from "./components/layout/Container";
import Footer from "./components/layout/Footer";

import PageSkeleton from "./components/ui/PageSkeleton";
import styles from "./App.module.css";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Workouts = lazy(() => import("./pages/Workouts"));
const NewWorkout = lazy(() => import("./pages/NewWorkout"));
const WorkoutDetails = lazy(() => import("./pages/WorkoutDetails"));
const Progress = lazy(() => import("./pages/Progress"));
const History = lazy(() => import("./pages/History"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className={styles.loading} role="status">
                <span className={styles.spinner} aria-hidden="true" />
                <p>Carregando seus dados...</p>
            </div>
        );
    }

    if (!user) {
        return <Suspense fallback={<PageSkeleton />}><Login /></Suspense>;
    }

    return (
        <>
            <Navbar />

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "var(--card)",
                        color: "var(--title)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                    },
                }}
            />

            <Container>
                <Suspense fallback={<PageSkeleton />}>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/workouts"
                        element={<Workouts />}
                    />

                    <Route
                        path="/workouts/new"
                        element={<NewWorkout />}
                    />

                    <Route
                        path="/workouts/:id"
                        element={<WorkoutDetails />}
                    />

                    <Route
                        path="/progress"
                        element={<Progress />}
                    />

                    <Route
                        path="/history"
                        element={<History />}
                    />

                    <Route
                        path="/calendar"
                        element={<Calendar />}
                    />
                </Routes>
                </Suspense>
            </Container>

            <Footer />
        </>
    );
}

export default App;
