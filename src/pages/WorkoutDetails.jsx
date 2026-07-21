import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import ExerciseCard from "../components/workout/ExerciseCard";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useHistory } from "../contexts/HistoryContext";
import { useWorkout } from "../contexts/WorkoutContext";
import { clearActiveWorkout } from "../services/activeWorkoutStorage";

import styles from "./WorkoutDetails.module.css";

const emptyExercise = {
    name: "",
    series: "",
    reps: "",
    weight: "",
};

function WorkoutDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        getWorkoutById,
        addExerciseToWorkout,
        updateExerciseFromWorkout,
        deleteExerciseFromWorkout,
        updateWorkout,
        duplicateWorkout,
        deleteWorkout,
    } = useWorkout();

    const { completeWorkout } = useHistory();

    const workout = getWorkoutById(id);

    const [activeForm, setActiveForm] = useState(null);
    const [editingExerciseId, setEditingExerciseId] =
        useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [workoutForm, setWorkoutForm] = useState({
        name: "",
        muscle: "",
    });

    const [exerciseForm, setExerciseForm] =
        useState(emptyExercise);

    function openExerciseForm(exercise = null) {
        setActiveForm("exercise");

        setEditingExerciseId(exercise?.id ?? null);

        setExerciseForm(
            exercise
                ? {
                      name: exercise.name,
                      series: exercise.series,
                      reps: exercise.reps,
                      weight: exercise.weight,
                  }
                : emptyExercise
        );
    }

    function openWorkoutForm() {
        setActiveForm("workout");

        setWorkoutForm({
            name: workout.name,
            muscle: workout.muscle,
        });
    }

    function closeForm() {
        setActiveForm(null);
        setEditingExerciseId(null);
        setExerciseForm(emptyExercise);
    }

    function updateExerciseField(event) {
        const { name, value } = event.target;

        setExerciseForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function updateWorkoutField(event) {
        const { name, value } = event.target;

        setWorkoutForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleExerciseSubmit(event) {
        event.preventDefault();

        const name = exerciseForm.name.trim();

        if (
            !name ||
            !exerciseForm.series ||
            !exerciseForm.reps ||
            exerciseForm.weight === ""
        ) {
            toast.error("Preencha todos os campos.");
            return;
        }

        const exerciseData = {
            name,
            series: Number(exerciseForm.series),
            reps: Number(exerciseForm.reps),
            weight: Number(exerciseForm.weight),
        };

        if (editingExerciseId) {
            await updateExerciseFromWorkout(
                id,
                editingExerciseId,
                exerciseData
            );

            toast.success("Exercício atualizado!");
        } else {
            await addExerciseToWorkout(
                id,
                exerciseData
            );

            toast.success("Exercício adicionado!");
        }

        closeForm();
    }

    async function handleWorkoutSubmit(event) {
        event.preventDefault();

        const name = workoutForm.name.trim();
        const muscle = workoutForm.muscle.trim();

        if (!name || !muscle) {
            toast.error("Preencha todos os campos.");
            return;
        }

        await updateWorkout(id, {
            name,
            muscle,
        });

        toast.success("Treino atualizado!");
        closeForm();
    }

    async function handleDeleteExercise(exerciseId) {
        await deleteExerciseFromWorkout(
            id,
            exerciseId
        );

        if (editingExerciseId === exerciseId) {
            closeForm();
        }

        toast.success("Exercício removido!");
    }

    async function handleDuplicateWorkout() {
        await duplicateWorkout(id);
        toast.success("Treino duplicado!");
    }

    async function handleCompleteWorkout() {
        await completeWorkout(workout);
        clearActiveWorkout();

        toast.success("Treino concluído!");
        navigate("/progress");
    }

    async function handleDeleteWorkout() {
        try {
            setIsDeleting(true);
            await deleteWorkout(id);
            clearActiveWorkout();
            toast.success("Treino removido!");
            navigate("/workouts");
        } catch {
            toast.error("Não foi possível remover o treino.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
        }
    }

    if (!workout) {
        return (
            <section className={styles.notFound}>
                <h1>Treino não encontrado</h1>

                <p>
                    Este treino não existe ou foi removido.
                </p>

                <Link to="/workouts">
                    Voltar para treinos
                </Link>
            </section>
        );
    }

    const exercises = workout.exercises ?? [];

    return (
        <section className={styles.page}>
            <Link
                to="/workouts"
                className={styles.back}
            >
                ← Voltar para treinos
            </Link>

            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <span>Detalhes do treino</span>

                    <h1>{workout.name}</h1>

                    <p>{workout.muscle}</p>

                    <small>
                        {exercises.length}{" "}
                        {exercises.length === 1
                            ? "exercício"
                            : "exercícios"}
                    </small>
                </div>

                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() =>
                            activeForm === "exercise" &&
                            !editingExerciseId
                                ? closeForm()
                                : openExerciseForm()
                        }
                    >
                        {activeForm === "exercise" &&
                        !editingExerciseId
                            ? "Cancelar"
                            : "Adicionar exercício"}
                    </button>

                    <div
                        className={
                            styles.secondaryActions
                        }
                    >
                        <button
                            type="button"
                            onClick={openWorkoutForm}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleDuplicateWorkout
                            }
                        >
                            Duplicar
                        </button>

                        <button
                            type="button"
                            className={
                                styles.deleteButton
                            }
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Excluir
                        </button>
                    </div>

                    <button
                        type="button"
                        className={
                            styles.completeButton
                        }
                        onClick={
                            handleCompleteWorkout
                        }
                    >
                        Concluir treino
                    </button>
                </div>
            </header>

            {activeForm === "workout" && (
                <form
                    className={styles.form}
                    onSubmit={handleWorkoutSubmit}
                >
                    <div className={styles.formHeader}>
                        <div>
                            <h2>Editar treino</h2>
                            <p>
                                Atualize as informações do
                                treino.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={closeForm}
                            aria-label="Fechar formulário"
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.workoutGrid}>
                        <label>
                            Nome do treino

                            <input
                                type="text"
                                name="name"
                                value={workoutForm.name}
                                onChange={
                                    updateWorkoutField
                                }
                                placeholder="Ex: Treino de peito"
                                autoFocus
                            />
                        </label>

                        <label>
                            Grupo muscular

                            <input
                                type="text"
                                name="muscle"
                                value={
                                    workoutForm.muscle
                                }
                                onChange={
                                    updateWorkoutField
                                }
                                placeholder="Ex: Peito e tríceps"
                            />
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={closeForm}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={
                                styles.primaryButton
                            }
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
            )}

            {activeForm === "exercise" && (
                <form
                    className={styles.form}
                    onSubmit={handleExerciseSubmit}
                >
                    <div className={styles.formHeader}>
                        <div>
                            <h2>
                                {editingExerciseId
                                    ? "Editar exercício"
                                    : "Novo exercício"}
                            </h2>

                            <p>
                                Informe os dados do
                                exercício.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={closeForm}
                            aria-label="Fechar formulário"
                        >
                            ×
                        </button>
                    </div>

                    <div
                        className={styles.exerciseGrid}
                    >
                        <label
                            className={styles.nameField}
                        >
                            Nome do exercício

                            <input
                                type="text"
                                name="name"
                                value={exerciseForm.name}
                                onChange={
                                    updateExerciseField
                                }
                                placeholder="Ex: Supino reto"
                                autoFocus
                            />
                        </label>

                        <label>
                            Séries

                            <input
                                type="number"
                                name="series"
                                min="1"
                                value={exerciseForm.series}
                                onChange={
                                    updateExerciseField
                                }
                                placeholder="4"
                            />
                        </label>

                        <label>
                            Repetições

                            <input
                                type="number"
                                name="reps"
                                min="1"
                                value={exerciseForm.reps}
                                onChange={
                                    updateExerciseField
                                }
                                placeholder="10"
                            />
                        </label>

                        <label>
                            Carga (kg)

                            <input
                                type="number"
                                name="weight"
                                min="0"
                                step="0.5"
                                value={exerciseForm.weight}
                                onChange={
                                    updateExerciseField
                                }
                                placeholder="60"
                            />
                        </label>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={closeForm}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={
                                styles.primaryButton
                            }
                        >
                            {editingExerciseId
                                ? "Atualizar exercício"
                                : "Salvar exercício"}
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.sectionHeader}>
                <div>
                    <span>Sequência do treino</span>
                    <h2>Exercícios</h2>
                </div>

                {exercises.length > 0 && (
                    <strong>{exercises.length}</strong>
                )}
            </div>

            <div className={styles.exercises}>
                {exercises.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>+</span>

                        <h3>Nenhum exercício adicionado</h3>

                        <p>
                            Adicione o primeiro exercício
                            para começar a montar este treino.
                        </p>

                        <button
                            type="button"
                            className={
                                styles.primaryButton
                            }
                            onClick={() =>
                                openExerciseForm()
                            }
                        >
                            Adicionar exercício
                        </button>
                    </div>
                ) : (
                    exercises.map((exercise) => (
                        <ExerciseCard
                            key={exercise.id}
                            workoutId={workout.id}
                            exercise={exercise}
                            onEdit={openExerciseForm}
                            onDelete={
                                handleDeleteExercise
                            }
                        />
                    ))
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Excluir este treino?"
                description="O treino e sua lista de exercícios serão removidos. Esta ação não pode ser desfeita."
                confirmLabel="Excluir treino"
                busy={isDeleting}
                onConfirm={handleDeleteWorkout}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </section>
    );
}

export default WorkoutDetails;
