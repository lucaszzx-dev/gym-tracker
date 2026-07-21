import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

import * as repository from "../firebase/workoutRepository";

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
    const { user } = useAuth();

    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        if (!user) {
            setWorkouts([]);
            return undefined;
        }

        const unsubscribe = repository.subscribe(
            user.uid,
            setWorkouts
        );

        return unsubscribe;
    }, [user]);

    async function createWorkout(workout) {
        if (!user) {
            throw new Error(
                "Usuário não autenticado."
            );
        }

        await repository.create(
            user.uid,
            workout
        );
    }

    async function deleteWorkout(workoutId) {
        await repository.remove(
            workoutId
        );
    }

    async function duplicateWorkout(workoutId) {
        await repository.duplicate(
            workoutId
        );
    }

    async function updateWorkout(
        workoutId,
        data
    ) {
        await repository.update(
            workoutId,
            data
        );
    }

    async function addExerciseToWorkout(
        workoutId,
        exercise
    ) {
        await repository.addExercise(
            workoutId,
            exercise
        );
    }

    async function updateExerciseFromWorkout(
        workoutId,
        exerciseId,
        exercise
    ) {
        await repository.updateExercise(
            workoutId,
            exerciseId,
            exercise
        );
    }

    async function deleteExerciseFromWorkout(
        workoutId,
        exerciseId
    ) {
        await repository.deleteExercise(
            workoutId,
            exerciseId
        );
    }

    function getWorkoutById(id) {
        return workouts.find(
            (workout) =>
                workout.id === id
        );
    }

    const value = {
        workouts,
        createWorkout,
        deleteWorkout,
        duplicateWorkout,
        updateWorkout,
        addExerciseToWorkout,
        updateExerciseFromWorkout,
        deleteExerciseFromWorkout,
        getWorkoutById,
    };

    return (
        <WorkoutContext.Provider
            value={value}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(
        WorkoutContext
    );

    if (!context) {
        throw new Error(
            "useWorkout deve ser usado dentro de WorkoutProvider."
        );
    }

    return context;
}
