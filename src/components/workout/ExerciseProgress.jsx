import styles from "./ExerciseProgress.module.css";

function ExerciseProgress({
    completedSets,
    totalSets,
}) {

    const percentage =
        totalSets > 0
            ? (completedSets / totalSets) * 100
            : 0;

    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <span>
                    Série {Math.min(completedSets + 1, totalSets)} de {totalSets}
                </span>

                <strong>
                    {completedSets}/{totalSets}
                </strong>

            </div>

            <div className={styles.bar}>

                <div
                    className={styles.fill}
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>
    );
}

export default ExerciseProgress;