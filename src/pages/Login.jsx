import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css";

function Login() {
    const { signIn } = useAuth();

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <div className={styles.brandMark} aria-hidden="true">GT</div>
                <span className={styles.eyebrow}>Seu treino, organizado</span>
                <h1>Gym Tracker</h1>
                <p>
                    Organize seus treinos, acompanhe sua evolução e mantenha
                    sua rotina em um só lugar.
                </p>
                <button onClick={signIn} className={styles.loginButton}>
                    Entrar com Google
                </button>
                <small>Seus dados ficam sincronizados com sua conta.</small>
            </section>
        </main>
    );
}

export default Login;
