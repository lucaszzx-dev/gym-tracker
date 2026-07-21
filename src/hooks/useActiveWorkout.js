import { useEffect, useState } from "react";

import {
    getExerciseProgress,
    updateExerciseProgress,
} from "../services/activeWorkoutStorage";

export default function useActiveWorkout(
    workoutId,
    exercise
) {
    const [progress, setProgress] = useState(() =>
        getExerciseProgress(
            workoutId,
            exercise.id
        )
    );

    useEffect(() => {
        updateExerciseProgress(
            workoutId,
            exercise.id,
            progress
        );
    }, [
        progress,
        workoutId,
        exercise.id,
    ]);

    function completeSet() {
        if (progress.status === "completed") {
            return;
        }

        const totalSets = Number(
            exercise.series
        );

        const next =
            progress.completedSets + 1;

        if (next >= totalSets) {
            setProgress({
                completedSets: totalSets,
                status: "completed",
            });

            return;
        }

        setProgress({
            completedSets: next,
            status: "resting",
        });
    }

    function finishRest() {
        setProgress((current) => ({
            ...current,
            status: "ready",
        }));
    }

    function startNextSet() {
        setProgress((current) => ({
            ...current,
            status: "active",
        }));
    }

    return {
        progress,
        completeSet,
        finishRest,
        startNextSet,
    };
}