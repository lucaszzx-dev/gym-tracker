import { useAuth } from "../contexts/AuthContext";
import { useWorkout } from "../contexts/WorkoutContext";
import { useHistory } from "../contexts/HistoryContext";
import { useWeight } from "../contexts/WeightContext";
import { useGoal } from "../contexts/GoalContext";
import styles from "./Profile.module.css";

function Profile() {
    const { user, signOutUser } = useAuth();
    const { workouts } = useWorkout();
    const { history } = useHistory();
    const { weights } = useWeight();
    const { goal } = useGoal();
    const currentWeight = weights.length > 0 ? weights[0].weight : "--";

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <span>Sua conta</span>
                <h1>Perfil</h1>
                <p>Veja seus dados e um resumo da sua jornada.</p>
            </header>

            <div className={styles.card}>
                <div className={styles.identity}>
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || "Foto do perfil"}
                            className={styles.avatar}
                        />
                    ) : (
                        <div className={styles.avatarFallback} aria-hidden="true">
                            {(user.displayName || user.email || "U")[0].toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2>{user.displayName || "Usuário"}</h2>
                        <p>{user.email}</p>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div><strong>{workouts.length}</strong><span>Treinos</span></div>
                    <div><strong>{history.length}</strong><span>Concluídos</span></div>
                    <div><strong>{currentWeight}</strong><span>Peso (kg)</span></div>
                    <div><strong>{goal ?? "--"}</strong><span>Meta (kg)</span></div>
                </div>

                <div className={styles.accountActions}>
                    <div>
                        <h3>Sessão da conta</h3>
                        <p>Encerre o acesso deste dispositivo com segurança.</p>
                    </div>
                    <button onClick={signOutUser} className={styles.logout}>
                        Sair da conta
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Profile;
