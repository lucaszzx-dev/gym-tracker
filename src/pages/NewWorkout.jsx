import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useWorkout } from "../contexts/WorkoutContext";
import styles from "./NewWorkout.module.css";

function NewWorkout() {
    const [name, setName] = useState("");
    const [muscle, setMuscle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { createWorkout } = useWorkout();

    async function handleSubmit(event) {
        event.preventDefault();

        if (!name || !muscle) {
            toast.error("Preencha todos os campos.");
            return;
        }

        try {
            setIsSaving(true);
            await createWorkout({ name: name.trim(), muscle: muscle.trim() });
            toast.success("Treino criado com sucesso!");
            navigate("/workouts");
        } catch {
            toast.error("Não foi possível criar o treino.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section className={styles.page}>
            <Link to="/workouts" className={styles.back}>
                ← Voltar para treinos
            </Link>

            <header className={styles.header}>
                <span>Montar rotina</span>
                <h1>Novo treino</h1>
                <p>
                    Defina as informações iniciais. Você poderá adicionar
                    exercícios na próxima etapa.
                </p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                    <h2>Informações do treino</h2>
                    <p>
                        Dê um nome claro e informe o principal grupo muscular.
                    </p>
                </div>

                <div className={styles.formGrid}>
                    <label className={styles.formControl}>
                        <span>Nome do treino</span>
                        <input
                            type="text"
                            placeholder="Ex: Treino A"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoFocus
                        />
                    </label>

                    <label className={styles.formControl}>
                        <span>Grupo muscular</span>
                        <input
                            type="text"
                            placeholder="Ex: Peito e tríceps"
                            value={muscle}
                            onChange={(event) => setMuscle(event.target.value)}
                        />
                    </label>
                </div>

                <div className={styles.actions}>
                    <Link to="/workouts">Cancelar</Link>
                    <button type="submit" disabled={isSaving}>
                        {isSaving ? "Criando..." : "Criar treino"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default NewWorkout;
