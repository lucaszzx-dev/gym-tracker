import { useMemo, useState } from "react";
import { useHistory } from "../../contexts/HistoryContext";
import styles from "./CalendarView.module.css";

function CalendarView() {
    const { history } = useHistory();

    const today = new Date();

    const [currentDate, setCurrentDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const [selectedDay, setSelectedDay] = useState(null);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const monthName = currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = useMemo(() => {
        const calendarDays = [];

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }

        return calendarDays;
    }, [firstDay, daysInMonth]);

    function previousMonth() {
        setSelectedDay(null);
        setCurrentDate(new Date(year, month - 1, 1));
    }

    function nextMonth() {
        setSelectedDay(null);
        setCurrentDate(new Date(year, month + 1, 1));
    }

    function getWorkoutsFromDay(day) {
        if (!day) return [];

        return history.filter((workout) => {
            const workoutDate = new Date(workout.completedAt);

            return (
                workoutDate.getDate() === day &&
                workoutDate.getMonth() === month &&
                workoutDate.getFullYear() === year
            );
        });
    }

    function hasWorkout(day) {
        return getWorkoutsFromDay(day).length > 0;
    }

    const selectedWorkouts = selectedDay
        ? getWorkoutsFromDay(selectedDay)
        : [];

        const streak = (() => {

    if (history.length === 0) return 0;

    const uniqueDays = [
        ...new Set(
            history.map(item =>
                new Date(item.completedAt).toDateString()
            )
        ),
    ];

    uniqueDays.sort(
        (a, b) => new Date(b) - new Date(a)
    );

    let count = 0;

    let current = new Date();

    current.setHours(0, 0, 0, 0);

    for (;;) {

        const currentString = current.toDateString();

        if (uniqueDays.includes(currentString)) {

            count++;

            current.setDate(current.getDate() - 1);

        } else {

            break;

        }

    }

    return count;

})();

    return (
    <div className={styles.container}>

        <div className={styles.header}>
                    <button onClick={previousMonth} aria-label="Mês anterior">Anterior</button>

            <h2>{monthName}</h2>

                    <button onClick={nextMonth} aria-label="Próximo mês">Próximo</button>
        </div>

        {/* NOVO CARD */}

        <div className={styles.streakCard}>

                            <span>Sequência</span>

            <div>

                <h3>Sequência atual</h3>

                <strong>{streak} dias</strong>

            </div>

        </div>

        {/* CONTINUA NORMAL */}

        <div className={styles.weekDays}>
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
        </div>

            <div className={styles.calendar}>
                {days.map((day, index) => {
                    const workoutsOfDay = getWorkoutsFromDay(day);
                    const isSelected = selectedDay === day;

                    return (
                        <button
                            key={index}
                            disabled={!day}
                            onClick={() => setSelectedDay(day)}
                            className={`
                                ${styles.day}
                                ${hasWorkout(day) ? styles.activeDay : ""}
                                ${isSelected ? styles.selectedDay : ""}
                            `}
                        >
                            {day && (
                                <>
                                    <span>{day}</span>

                                    {workoutsOfDay.length > 0 && (
                                        <small>{workoutsOfDay.length}</small>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedDay && (
                <div className={styles.selectedPanel}>
                    <h3>
                        Treinos de{" "}
                        {new Date(year, month, selectedDay).toLocaleDateString(
                            "pt-BR"
                        )}
                    </h3>

                    {selectedWorkouts.length === 0 ? (
                        <div className={styles.emptyDay}>
                            <p>Nenhum treino concluído nesse dia.</p>
                        </div>
                    ) : (
                        <div className={styles.workoutList}>
                            {selectedWorkouts.map((workout) => (
                                <div
                                    key={workout.id}
                                    className={styles.workoutCard}
                                >
                                    <div>
                                        <h4>{workout.workoutName}</h4>
                                        <p>{workout.muscle}</p>
                                    </div>

                                    <strong>
                                        {workout.exercisesCount} exercícios
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CalendarView;
