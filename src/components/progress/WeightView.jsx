import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useGoal } from "../../contexts/GoalContext";
import { useWeight } from "../../contexts/WeightContext";
import ConfirmDialog from "../ui/ConfirmDialog";
import styles from "./WeightView.module.css";
import { calculateWeightProgress } from "../../utils/progressMetrics";

function WeightView() {
    const { weights, saveWeight, deleteWeight } = useWeight();
    const { goal, saveGoal } = useGoal();
    const [weight, setWeight] = useState("");
    const [goalInput, setGoalInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const sortedWeights = useMemo(() => [...weights].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), [weights]);
    const chartData = sortedWeights.map((item) => ({ id: item.id, weight: Number(item.weight), date: new Date(item.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) }));
    const currentWeight = weights.length ? Number(weights[0].weight) : null;
    const firstWeight = sortedWeights.length ? Number(sortedWeights[0].weight) : null;
    const highestWeight = weights.length ? Math.max(...weights.map((item) => Number(item.weight))) : null;
    const lowestWeight = weights.length ? Math.min(...weights.map((item) => Number(item.weight))) : null;
    const difference = currentWeight !== null && firstWeight !== null ? currentWeight - firstWeight : null;
    const remaining = goal && currentWeight ? currentWeight - Number(goal) : null;
    const progress = calculateWeightProgress(firstWeight, currentWeight, Number(goal));

    async function handleSubmit(event) {
        event.preventDefault();
        const value = Number(weight);
        if (!value || value <= 0) return toast.error("Digite um peso válido.");
        try {
            setIsSaving(true);
            await saveWeight(value);
            setWeight("");
            toast.success("Peso salvo.");
        } catch {
            toast.error("Não foi possível salvar o peso.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleSaveGoal() {
        const value = Number(goalInput);
        if (!value || value <= 0) return toast.error("Digite uma meta válida.");
        try {
            setIsSaving(true);
            await saveGoal(value);
            setGoalInput("");
            toast.success("Meta salva.");
        } catch {
            toast.error("Não foi possível salvar a meta.");
        } finally {
            setIsSaving(false);
        }
    }

    async function confirmDelete() {
        try {
            await deleteWeight(deletingId);
            toast.success("Pesagem removida.");
            setDeletingId(null);
        } catch {
            toast.error("Não foi possível remover a pesagem.");
        }
    }

    const format = (value) => value === null ? "--" : `${value.toFixed(1)} kg`;

    return (
        <div className={styles.container}>
            <div className={styles.header}><div><h2>Peso corporal</h2><p>Registre suas pesagens e acompanhe sua evolução.</p></div>{currentWeight !== null && <div className={styles.currentWeight}><span>Peso atual</span><strong>{format(currentWeight)}</strong></div>}</div>
            <form onSubmit={handleSubmit} className={styles.form}><div className={styles.inputGroup}><label htmlFor="new-weight">Nova pesagem</label><div className={styles.inputWrapper}><input id="new-weight" type="number" min="0.1" step="0.1" placeholder="Ex: 84,5" value={weight} onChange={(event) => setWeight(event.target.value)} /><span>kg</span></div></div><button disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar peso"}</button></form>
            <div className={styles.stats}>
                <div className={styles.statCard}><p>Peso atual</p><strong>{format(currentWeight)}</strong></div>
                <div className={styles.statCard}><p>Maior peso</p><strong>{format(highestWeight)}</strong></div>
                <div className={styles.statCard}><p>Menor peso</p><strong>{format(lowestWeight)}</strong></div>
                <div className={styles.statCard}><p>Variação</p><strong className={difference < 0 ? styles.negative : difference > 0 ? styles.positive : ""}>{difference === null ? "--" : `${difference > 0 ? "+" : ""}${difference.toFixed(1)} kg`}</strong></div>
            </div>
            <div className={styles.goalCard}><h3>Meta de peso</h3><div className={styles.goalForm}><input aria-label="Meta de peso" type="number" min="0.1" step="0.1" placeholder="Ex: 80" value={goalInput} onChange={(event) => setGoalInput(event.target.value)} /><button type="button" disabled={isSaving} onClick={handleSaveGoal}>Salvar meta</button></div>{goal && <><div className={styles.progressBar} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100"><div className={styles.progress} style={{ width: `${progress}%` }} /></div><div className={styles.goalInfo}><span>Meta <strong>{format(Number(goal))}</strong></span><span>Diferença <strong>{format(remaining)}</strong></span><span><strong>{progress.toFixed(0)}%</strong></span></div></>}</div>
            <div className={styles.chartCard} role="img" aria-label={`Evolução do peso com ${chartData.length} registros.`}><div className={styles.sectionHeader}><div><h3>Evolução do peso</h3><p>Acompanhe suas medidas ao longo do tempo.</p></div></div>{chartData.length === 0 ? <div className={styles.empty}><h3>Nenhuma pesagem registrada</h3><p>Salve sua primeira pesagem para visualizar o gráfico.</p></div> : <ResponsiveContainer width="100%" height={320}><LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="date" tick={{ fill: "var(--text)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} /><YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fill: "var(--text)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} width={45} /><Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3} dot={{ fill: "var(--primary)", r: 5 }} /></LineChart></ResponsiveContainer>}</div>
            <div className={styles.historySection}><div className={styles.sectionHeader}><div><h3>Histórico de pesagens</h3><p>{weights.length} registros</p></div></div>{weights.length === 0 ? <div className={styles.emptyHistory}>Nenhuma pesagem registrada.</div> : <div className={styles.history}>{weights.map((item) => <div key={item.id} className={styles.historyCard}><div><strong>{format(Number(item.weight))}</strong><p>{new Date(item.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p></div><button type="button" onClick={() => setDeletingId(item.id)}>Excluir</button></div>)}</div>}</div>
            <ConfirmDialog open={Boolean(deletingId)} title="Excluir esta pesagem?" description="O registro será removido permanentemente do seu histórico." confirmLabel="Excluir pesagem" onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />
        </div>
    );
}

export default WeightView;
