import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGoal } from "../contexts/GoalContext";
import { useHistory } from "../contexts/HistoryContext";
import { useWeight } from "../contexts/WeightContext";
import { useWorkout } from "../contexts/WorkoutContext";
import styles from "./Home.module.css";
import { calculateStreak, completedDaysInWeek } from "../utils/progressMetrics";

function Home() {
    const { user } = useAuth();
    const { goal } = useGoal();
    const { history } = useHistory();
    const { weights } = useWeight();
    const { workouts } = useWorkout();

    const hour = new Date().getHours();
    const greeting = hour >= 5 && hour < 12
        ? "Bom dia"
        : hour >= 12 && hour < 18
            ? "Boa tarde"
            : "Boa noite";
    const firstName = user?.displayName?.split(" ")[0] || "atleta";
    const currentWeight = weights[0]?.weight;
    const streak = calculateStreak(history);
    const lastWorkout = history[0];
    const savedLastWorkout = workouts.find(
        (workout) => workout.id === lastWorkout?.workoutId
    );

    const completedThisWeek = completedDaysInWeek(history);

    return (
        <div className={styles.home}>
            <header className={styles.hero}>
                <div>
                    <span className={styles.eyebrow}>Visão geral</span>
                    <h1>{greeting}, {firstName}.</h1>
                    <p>Continue construindo sua evolução, um treino por vez.</p>
                </div>
                <div className={styles.heroAside}>
                    <div className={styles.heroNumbers}>
                        <div><strong>{workouts.length}</strong><span>treinos</span></div>
                        <div><strong>{history.length}</strong><span>concluídos</span></div>
                    </div>
                    <Link to="/workouts" className={styles.primaryAction}>
                        Ver meus treinos
                    </Link>
                </div>
            </header>

            <section className={styles.metrics} aria-label="Resumo da evolução">
                <article className={`${styles.metricCard} ${styles.weightCard}`}>
                    <small>01</small>
                    <span>Peso atual</span>
                    <strong>{currentWeight ? `${Number(currentWeight).toFixed(1)} kg` : "--"}</strong>
                    <p>Meta: {goal ? `${Number(goal).toFixed(1)} kg` : "não definida"}</p>
                    <Link to="/progress">Atualizar peso →</Link>
                </article>

                <article className={styles.metricCard}>
                    <small>02</small>
                    <span>Sequência atual</span>
                    <strong>{streak} {streak === 1 ? "dia" : "dias"}</strong>
                    <p>{streak > 0 ? "Mantenha o ritmo." : "Conclua um treino para começar."}</p>
                    <Link to="/calendar">Ver calendário →</Link>
                </article>

                <article className={styles.metricCard}>
                    <small>03</small>
                    <span>Esta semana</span>
                    <strong>{completedThisWeek}</strong>
                    <p>{completedThisWeek === 1 ? "dia com treino concluído" : "dias com treino concluído"}</p>
                    <Link to="/history">Ver histórico →</Link>
                </article>
            </section>

            <section className={styles.activityCard}>
                <div className={styles.activityHeader}>
                    <div>
                        <span className={styles.eyebrow}>Atividade recente</span>
                        <h2>Último treino</h2>
                    </div>
                    <span className={styles.total}>{history.length} concluídos</span>
                </div>

                {lastWorkout ? (
                    <div className={styles.lastWorkout}>
                        <div>
                            <strong>{lastWorkout.workoutName}</strong>
                            <p>
                                {lastWorkout.muscle} · {lastWorkout.exercisesCount} exercícios ·{" "}
                                {new Date(lastWorkout.completedAt).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                        <Link to={savedLastWorkout ? `/workouts/${savedLastWorkout.id}` : "/workouts"}>
                            {savedLastWorkout ? "Abrir treino →" : "Ver treinos →"}
                        </Link>
                    </div>
                ) : (
                    <div className={styles.emptyActivity}>
                        <p>Você ainda não concluiu nenhum treino.</p>
                        <Link to="/workouts">Escolher um treino</Link>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
