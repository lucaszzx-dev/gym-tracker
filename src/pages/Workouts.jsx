import { useState } from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../contexts/WorkoutContext";
import WorkoutCard from "../components/workout/WorkoutCard";
import styles from "./Workouts.module.css";

function Workouts() {
    const { workouts } = useWorkout();
    const [search, setSearch] = useState("");
    const [muscleFilter, setMuscleFilter] = useState("Todos");
    const [sortBy, setSortBy] = useState("recent");

    const muscles = [
        "Todos",
        ...new Set(workouts.map((workout) => workout.muscle)),
    ];

    const filteredWorkouts = workouts
        .filter((workout) =>
            workout.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((workout) =>
            muscleFilter === "Todos"
                ? true
                : workout.muscle === muscleFilter
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "old":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "az":
                    return a.name.localeCompare(b.name);
                case "za":
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

    return (
        <section className={styles.page}>
            <div className={styles.topBar}>
                <div className={styles.heading}>
                    <span>Biblioteca de treinos</span>
                    <h1>Meus Treinos</h1>
                    <p>Encontre e organize suas rotinas de treino.</p>
                </div>

                <Link to="/workouts/new" className={styles.newButton}>
                    + Novo treino
                </Link>
            </div>

            <div className={styles.filters} aria-label="Filtros de treino">
                <label>
                    <span>Pesquisar</span>
                    <input
                        type="search"
                        placeholder="Nome do treino..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>

                <label>
                    <span>Grupo muscular</span>
                    <select
                        value={muscleFilter}
                        onChange={(event) =>
                            setMuscleFilter(event.target.value)
                        }
                    >
                        {muscles.map((muscle) => (
                            <option key={muscle} value={muscle}>
                                {muscle}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Ordenar por</span>
                    <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option value="recent">Mais recentes</option>
                        <option value="old">Mais antigos</option>
                        <option value="az">A → Z</option>
                        <option value="za">Z → A</option>
                    </select>
                </label>
            </div>

            <div className={styles.listHeader}>
                <h2>Treinos salvos</h2>
                <span className={styles.counter}>
                    {filteredWorkouts.length}
                </span>
            </div>

            <div className={styles.list}>
                {filteredWorkouts.length === 0 ? (
                    <div className={styles.empty}>
                        <span>+</span>
                        <h2>Nenhum treino encontrado</h2>
                        <p>
                            {workouts.length === 0
                                ? "Crie seu primeiro treino para começar."
                                : "Tente ajustar os filtros da pesquisa."}
                        </p>
                        {workouts.length === 0 && (
                            <Link to="/workouts/new">Criar treino</Link>
                        )}
                    </div>
                ) : (
                    filteredWorkouts.map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} />
                    ))
                )}
            </div>
        </section>
    );
}

export default Workouts;
