import { useHistory } from "../contexts/HistoryContext";
import styles from "./History.module.css";

function History() {
    const { history } = useHistory();

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <span>Atividade concluída</span>
                <h1>Histórico</h1>
                <p>Consulte sua consistência e os treinos já realizados.</p>
            </header>

            <div className={styles.sectionHeader}>
                <h2>Treinos concluídos</h2>
                <strong>{history.length}</strong>
            </div>

            {history.length === 0 ? (
                <div className={styles.empty}>
                    <span>✓</span>
                    <h2>Nenhum treino concluído ainda</h2>
                    <p>
                        Quando você concluir um treino, ele aparecerá aqui.
                    </p>
                </div>
            ) : (
                <div className={styles.list}>
                    {history.map((item) => (
                        <article key={item.id} className={styles.card}>
                            <div className={styles.workoutInfo}>
                                <span>{item.muscle}</span>
                                <h2>{item.workoutName}</h2>
                            </div>

                            <div className={styles.metric}>
                                <strong>{item.exercisesCount}</strong>
                                <p>exercícios</p>
                            </div>

                            <div className={styles.metric}>
                                <strong>
                                    {new Date(item.completedAt).toLocaleDateString(
                                        "pt-BR"
                                    )}
                                </strong>
                                <p>concluído</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default History;
