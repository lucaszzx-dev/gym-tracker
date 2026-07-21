import { useMemo, useState } from "react";
import { useHistory } from "../contexts/HistoryContext";
import styles from "./Calendar.module.css";

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const dateKey = (date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

function Calendar() {
    const { history } = useHistory();
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    const [selectedDay, setSelectedDay] = useState(null);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    const calendarDays = useMemo(() => {
        const emptyDays = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();
        return Array.from(
            { length: emptyDays + totalDays },
            (_, index) => (index < emptyDays ? null : index - emptyDays + 1)
        );
    }, [year, month]);

    const workoutsByDay = useMemo(() => {
        const grouped = new Map();
        history.forEach((workout) => {
            const key = dateKey(new Date(workout.completedAt));
            grouped.set(key, [...(grouped.get(key) || []), workout]);
        });
        return grouped;
    }, [history]);

    const getWorkouts = (day) =>
        day ? workoutsByDay.get(`${year}-${month}-${day}`) || [] : [];

    const changeMonth = (offset) => {
        setSelectedDay(null);
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const selectedWorkouts = getWorkouts(selectedDay);

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div className={styles.heading}>
                    <span>Frequência de treino</span>
                    <h1>Calendário</h1>
                    <p>Acompanhe os dias em que você concluiu treinos.</p>
                </div>
                <div className={styles.controls}>
                    <button type="button" onClick={() => changeMonth(-1)}>
                        ← <span>Anterior</span>
                    </button>
                    <strong>{monthName}</strong>
                    <button type="button" onClick={() => changeMonth(1)}>
                        <span>Próximo</span> →
                    </button>
                </div>
            </header>

            <div className={styles.calendar}>
                <div className={styles.weekDays}>
                    {WEEK_DAYS.map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className={styles.days}>
                    {calendarDays.map((day, index) => {
                        const workouts = getWorkouts(day);
                        return (
                            <button
                                type="button"
                                key={day || `empty-${index}`}
                                disabled={!day}
                                onClick={() => setSelectedDay(day)}
                                aria-label={day ? `Dia ${day}, ${workouts.length} treinos` : undefined}
                                className={`${styles.day} ${workouts.length ? styles.hasWorkout : ""} ${selectedDay === day ? styles.selected : ""}`}
                            >
                                {day && (
                                    <>
                                        <span>{day}</span>
                                        {workouts.length > 0 && <small>{workouts.length}</small>}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.details}>
                {!selectedDay ? (
                    <p>Selecione um dia para ver os treinos concluídos.</p>
                ) : selectedWorkouts.length === 0 ? (
                    <p>Nenhum treino concluído nesse dia.</p>
                ) : (
                    <>
                        <h2>
                            Treinos em{" "}
                            {new Date(year, month, selectedDay).toLocaleDateString("pt-BR")}
                        </h2>
                        <div className={styles.historyList}>
                            {selectedWorkouts.map((workout) => (
                                <article key={workout.id} className={styles.historyCard}>
                                    <div>
                                        <h3>{workout.workoutName}</h3>
                                        <p>{workout.muscle}</p>
                                    </div>
                                    <strong>{workout.exercisesCount} exercícios</strong>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default Calendar;
