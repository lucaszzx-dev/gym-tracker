import { useState } from "react";

import toast from "react-hot-toast";

import RestTimer from "../timer/RestTimer";
import ExerciseProgress from "./ExerciseProgress";
import SeriesButton from "./SeriesButton";

import useActiveWorkout from "../../hooks/useActiveWorkout";

import styles from "../../pages/WorkoutDetails.module.css";

function ExerciseCard({
    workoutId,
    exercise,
    onEdit,
    onDelete,
}) {
    const {
        progress,
        completeSet,
        finishRest,
        startNextSet,
    } = useActiveWorkout(
        workoutId,
        exercise
    );

    const [timerSignal, setTimerSignal] =
        useState(0);

    function handleSeriesButton() {
        switch (progress.status) {
            case "active":

                completeSet();

                setTimerSignal((current) => current + 1);

                toast.success(
                    "Série concluída!"
                );

                break;

            case "ready":

                startNextSet();

                break;

            default:
                break;
        }
    }

    return (
        <div className={styles.exerciseCard}>
            <h3>{exercise.name}</h3>

            <p>
                {exercise.series} séries ×{" "}
                {exercise.reps} repetições
            </p>

            <div className={styles.exerciseFooter}>
                <strong>
                    {exercise.weight} kg
                </strong>

                <div
                    className={
                        styles.exerciseActions
                    }
                >
                    <button
                        className={
                            styles.editExerciseButton
                        }
                        onClick={() =>
                            onEdit(exercise)
                        }
                    >
                        Editar
                    </button>

                    <button
                        className={
                            styles.deleteExerciseButton
                        }
                        onClick={() =>
                            onDelete(
                                exercise.id
                            )
                        }
                    >
                        Excluir
                    </button>
                </div>
            </div>

            <ExerciseProgress
                completedSets={
                    progress.completedSets
                }
                totalSets={Number(
                    exercise.series
                )}
            />

            <SeriesButton
                status={progress.status}
                currentSet={
                    progress.completedSets + 1
                }
                totalSets={Number(
                    exercise.series
                )}
                onClick={
                    handleSeriesButton
                }
            />

            <div
                className={
                    styles.timerContainer
                }
            >
                <RestTimer
                    startSignal={
                        timerSignal
                    }
                    onFinish={
                        finishRest
                    }
                />
            </div>
        </div>
    );
}

export default ExerciseCard;