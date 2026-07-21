import { Link } from "react-router-dom";
import styles from "./WorkoutCard.module.css";

function WorkoutCard({ workout }) {
    const exerciseCount = workout.exercises?.length ?? 0;

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <span>{workout.muscle}</span>
                <h2>{workout.name}</h2>
                <p>
                    {exerciseCount}{" "}
                    {exerciseCount === 1 ? "exercício" : "exercícios"}
                </p>
            </div>

            <div className={styles.actions}>
                <Link to={`/workouts/${workout.id}`}>Ver detalhes →</Link>
            </div>
        </div>
    );
}

export default WorkoutCard;
