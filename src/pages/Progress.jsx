import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import CalendarView from "../components/progress/CalendarView";
import HeatmapView from "../components/progress/HeatmapView";
import WeightView from "../components/progress/WeightView";
import { useHistory } from "../contexts/HistoryContext";
import { useWorkout } from "../contexts/WorkoutContext";
import styles from "./Progress.module.css";

const TABS = [
    ["dashboard", "Dashboard"],
    ["history", "Histórico"],
    ["calendar", "Calendário"],
    ["weight", "Peso"],
    ["heatmap", "Atividades"],
];

function Progress() {
    const { workouts } = useWorkout();
    const { history } = useHistory();
    const [activeTab, setActiveTab] = useState("dashboard");
    const allExercises = workouts.flatMap((workout) => workout.exercises ?? []);
    const totalVolume = allExercises.reduce((total, exercise) => total + Number(exercise.series || 0) * Number(exercise.reps || 0) * Number(exercise.weight || 0), 0);
    const averageWeight = allExercises.length ? (allExercises.reduce((total, exercise) => total + Number(exercise.weight || 0), 0) / allExercises.length).toFixed(1) : 0;
    const muscleData = Object.values(workouts.reduce((result, workout) => {
        const key = workout.muscle || "Não informado";
        result[key] = { muscle: key, total: (result[key]?.total || 0) + 1 };
        return result;
    }, {}));
    const strongestExercise = allExercises.reduce((top, exercise) => !top || Number(exercise.weight) > Number(top.weight) ? exercise : top, null);
    const mostTrainedMuscle = muscleData.reduce((top, item) => !top || item.total > top.total ? item : top, null);
    const frequency = Object.values(allExercises.reduce((result, exercise) => {
        result[exercise.name] = { name: exercise.name, total: (result[exercise.name]?.total || 0) + 1 };
        return result;
    }, {}));
    const mostRepeated = frequency.reduce((top, item) => !top || item.total > top.total ? item : top, null);
    const records = Object.values(allExercises.reduce((result, exercise) => {
        if (!result[exercise.name] || Number(exercise.weight) > Number(result[exercise.name].weight)) result[exercise.name] = exercise;
        return result;
    }, {}));
    const sortedHistory = [...history].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    return (
        <section className={styles.page}>
            <header className={styles.pageHeader}>
                <span>Análise de desempenho</span>
                <h1>Evolução</h1>
                <p>Acompanhe seus treinos, medidas e melhores resultados.</p>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Seções de evolução">
                {TABS.map(([id, label]) => (
                    <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? styles.activeTab : ""} onClick={() => setActiveTab(id)}>{label}</button>
                ))}
            </div>

            {activeTab === "dashboard" && (
                <div className={styles.dashboard} role="tabpanel">
                    <div className={styles.cards}>
                        <div className={styles.card}><span>Treinos cadastrados</span><strong>{workouts.length}</strong><p>Rotinas disponíveis</p></div>
                        <div className={styles.card}><span>Exercícios</span><strong>{allExercises.length}</strong><p>Total cadastrado</p></div>
                        <div className={styles.card}><span>Volume estimado</span><strong>{totalVolume.toLocaleString("pt-BR")} kg</strong><p>Séries, repetições e carga</p></div>
                        <div className={styles.card}><span>Carga média</span><strong>{averageWeight} kg</strong><p>Entre os exercícios</p></div>
                    </div>

                    <div className={styles.chartCard} role="img" aria-label={`Gráfico de treinos por grupo muscular. ${muscleData.map((item) => `${item.muscle}: ${item.total}`).join(", ") || "Sem dados"}.`}>
                        <h2>Treinos por grupo muscular</h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={muscleData} margin={{ top: 20, right: 20, left: -15, bottom: 5 }}>
                                <CartesianGrid stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="muscle" tick={{ fill: "var(--text)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fill: "var(--text)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                <Bar dataKey="total" fill="var(--primary)" radius={[8, 8, 0, 0]} animationDuration={500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.insights}>
                        <div className={styles.insightCard}><span>Maior carga</span><strong>{strongestExercise ? `${strongestExercise.weight} kg` : "Nenhuma"}</strong><p>{strongestExercise?.name || "Cadastre exercícios para calcular."}</p></div>
                        <div className={styles.insightCard}><span>Grupo mais presente</span><strong>{mostTrainedMuscle?.muscle || "Nenhum"}</strong><p>{mostTrainedMuscle ? `${mostTrainedMuscle.total} treinos` : "Sem dados suficientes."}</p></div>
                        <div className={styles.insightCard}><span>Mais repetido</span><strong>{mostRepeated?.name || "Nenhum"}</strong><p>{mostRepeated ? `${mostRepeated.total} ocorrências` : "Sem dados suficientes."}</p></div>
                        <div className={styles.insightCard}><span>Última conclusão</span><strong>{sortedHistory[0]?.workoutName || "Nenhuma"}</strong><p>{sortedHistory[0] ? new Date(sortedHistory[0].completedAt).toLocaleDateString("pt-BR") : "Conclua um treino."}</p></div>
                    </div>

                    <div className={styles.recordsSection}><h2>Recordes pessoais</h2>{records.length === 0 ? <p className={styles.emptyState}>Nenhum recorde disponível.</p> : <div className={styles.recordsGrid}>{records.map((exercise) => <div key={exercise.name} className={styles.recordCard}><h3>{exercise.name}</h3><strong>{exercise.weight} kg</strong><p>Melhor carga registrada</p></div>)}</div>}</div>
                </div>
            )}

            {activeTab === "history" && <div className={styles.historyContainer} role="tabpanel"><h2>Histórico de treinos</h2>{sortedHistory.length === 0 ? <div className={styles.emptyState}><h3>Nenhum treino concluído</h3><p>Conclua um treino para começar seu histórico.</p></div> : sortedHistory.map((item) => <div key={item.id} className={styles.historyCard}><div><h3>{item.workoutName}</h3><p>{item.muscle}</p></div><div><strong>{item.exercisesCount}</strong><p>Exercícios</p></div><div><strong>{new Date(item.completedAt).toLocaleDateString("pt-BR")}</strong><p>Data</p></div></div>)}</div>}
            {activeTab === "calendar" && <CalendarView />}
            {activeTab === "weight" && <WeightView />}
            {activeTab === "heatmap" && <HeatmapView />}
        </section>
    );
}

export default Progress;
