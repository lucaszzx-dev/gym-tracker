import { Component } from "react";
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Erro não tratado na interface", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className={styles.page}>
                    <section className={styles.card}>
                        <span>Não foi possível carregar esta tela</span>
                        <h1>Algo saiu do esperado</h1>
                        <p>Atualize a página para tentar novamente. Seus dados salvos não foram removidos.</p>
                        <button type="button" onClick={() => window.location.reload()}>Atualizar página</button>
                    </section>
                </main>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
