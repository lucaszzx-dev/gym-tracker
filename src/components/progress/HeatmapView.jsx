import { useMemo, useState } from "react";
import { useHistory } from "../../contexts/HistoryContext";
import styles from "./HeatmapView.module.css";

function HeatmapView() {
    const { history } = useHistory();

    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedDate, setSelectedDate] = useState(null);

    const historyByDate = useMemo(() => {
        return history.reduce((acc, item) => {
            const date = new Date(item.completedAt);

            const dateKey = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
            ].join("-");

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            acc[dateKey].push(item);

            return acc;
        }, {});
    }, [history]);

    const yearDays = useMemo(() => {
        const days = [];

        const startDate = new Date(selectedYear, 0, 1);
        const endDate = new Date(selectedYear, 11, 31);

        const firstDayPosition = startDate.getDay();

        for (let index = 0; index < firstDayPosition; index++) {
            days.push(null);
        }

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");

            const dateKey = `${year}-${month}-${day}`;

            days.push({
                dateKey,
                date: new Date(currentDate),
                total: historyByDate[dateKey]?.length || 0,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    }, [historyByDate, selectedYear]);

    const availableYears = useMemo(() => {
        const years = history.map((item) =>
            new Date(item.completedAt).getFullYear()
        );

        return [...new Set([currentYear, ...years])].sort(
            (a, b) => b - a
        );
    }, [history, currentYear]);

    const activeDays = yearDays.filter(
        (day) => day && day.total > 0
    ).length;

    const totalCompletedWorkouts = yearDays.reduce((total, day) => {
        return total + (day?.total || 0);
    }, 0);

    const bestDay = yearDays.reduce((best, day) => {
        if (!day) {
            return best;
        }

        if (!best || day.total > best.total) {
            return day;
        }

        return best;
    }, null);

    const selectedWorkouts = selectedDate
        ? historyByDate[selectedDate.dateKey] || []
        : [];

    function getIntensityClass(total) {
        if (total === 0) {
            return styles.levelZero;
        }

        if (total === 1) {
            return styles.levelOne;
        }

        if (total === 2) {
            return styles.levelTwo;
        }

        return styles.levelThree;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>Mapa de atividades</h2>

                    <p>
                        Visualize sua frequência de treinos durante o ano.
                    </p>
                </div>

                <select
                    value={selectedYear}
                    onChange={(event) => {
                        setSelectedYear(Number(event.target.value));
                        setSelectedDate(null);
                    }}
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span>Período</span>

                    <div>
                        <strong>{activeDays}</strong>
                        <p>Dias ativos</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <span>Treinos</span>

                    <div>
                        <strong>{totalCompletedWorkouts}</strong>
                        <p>Treinos concluídos</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <span>Sequência</span>

                    <div>
                        <strong>{bestDay?.total || 0}</strong>
                        <p>Maior número em um dia</p>
                    </div>
                </div>
            </div>

            <div className={styles.heatmapCard}>
                <div className={styles.weekLabels}>
                    <span>Dom</span>
                    <span>Seg</span>
                    <span>Ter</span>
                    <span>Qua</span>
                    <span>Qui</span>
                    <span>Sex</span>
                    <span>Sáb</span>
                </div>

                <div className={styles.heatmapScroll}>
                    <div className={styles.heatmap}>
                        {yearDays.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className={styles.emptyCell}
                                    />
                                );
                            }

                            const isSelected =
                                selectedDate?.dateKey === day.dateKey;

                            return (
                                <button
                                    key={day.dateKey}
                                    type="button"
                                    title={`${day.date.toLocaleDateString(
                                        "pt-BR"
                                    )}: ${day.total} treino(s)`}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        ${styles.day}
                                        ${getIntensityClass(day.total)}
                                        ${
                                            isSelected
                                                ? styles.selectedDay
                                                : ""
                                        }
                                    `}
                                >
                                    <span>{day.date.getDate()}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.legend}>
                    <span>Menos</span>

                    <i className={styles.levelZero} />
                    <i className={styles.levelOne} />
                    <i className={styles.levelTwo} />
                    <i className={styles.levelThree} />

                    <span>Mais</span>
                </div>
            </div>

            {selectedDate && (
                <div className={styles.details}>
                    <h3>
                        {selectedDate.date.toLocaleDateString("pt-BR")}
                    </h3>

                    {selectedWorkouts.length === 0 ? (
                        <p>Nenhum treino concluído nesse dia.</p>
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

export default HeatmapView;
