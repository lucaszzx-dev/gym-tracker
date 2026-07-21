const STORAGE_KEY = "gym-tracker-active-workout";
export const ACTIVE_WORKOUT_EVENT = "gym-tracker-active-workout-change";

let notificationScheduled = false;

const notifyChange = () => {
    if (notificationScheduled) return;

    notificationScheduled = true;

    queueMicrotask(() => {
        notificationScheduled = false;
        window.dispatchEvent(new Event(ACTIVE_WORKOUT_EVENT));
    });
};

export function getActiveWorkout() {
    const storage = localStorage.getItem(STORAGE_KEY);

    if (!storage) {
        return null;
    }

    try {
        return JSON.parse(storage);
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function saveActiveWorkout(workout) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(workout)
    );
    notifyChange();
}

export function clearActiveWorkout() {
    localStorage.removeItem(STORAGE_KEY);
    notifyChange();
}

export function initializeWorkout(workoutId) {
    const current = getActiveWorkout();

    if (current?.workoutId === workoutId) {
        return current;
    }

    const workout = {
        workoutId,
        startedAt: new Date().toISOString(),
        exercises: {},
    };

    saveActiveWorkout(workout);

    return workout;
}

export function getExerciseProgress(
    workoutId,
    exerciseId
) {
    const workout = initializeWorkout(workoutId);

    return (
        workout.exercises[exerciseId] || {
            completedSets: 0,
            status: "active",
        }
    );
}

export function updateExerciseProgress(
    workoutId,
    exerciseId,
    progress
) {
    const workout = initializeWorkout(workoutId);

    workout.exercises[exerciseId] = progress;

    saveActiveWorkout(workout);
}
