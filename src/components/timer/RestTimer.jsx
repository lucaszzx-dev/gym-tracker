import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import styles from "./RestTimer.module.css";

const REST_OPTIONS = [30, 45, 60, 90, 120, 180];

function RestTimer({ startSignal = 0, onFinish }) {
    const [selectedTime, setSelectedTime] = useState(90);
    const [timeLeft, setTimeLeft] = useState(90);
    const [isRunning, setIsRunning] = useState(false);
    const previousSignal = useRef(startSignal);

    useEffect(() => {
        if (startSignal !== previousSignal.current) {
            previousSignal.current = startSignal;
            setTimeLeft(selectedTime);
            setIsRunning(true);
        }
    }, [startSignal, selectedTime]);

    useEffect(() => {
        if (!isRunning) return undefined;

        const timer = setTimeout(() => {
            if (timeLeft === 1) {
                setTimeLeft(0);
                setIsRunning(false);
                toast.success("Hora da próxima série.");

                if ("vibrate" in navigator) {
                    navigator.vibrate([300, 150, 300]);
                }

                onFinish?.();
                return;
            }

            setTimeLeft((current) => current - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isRunning, timeLeft, onFinish]);

    function handleReset() {
        setIsRunning(false);
        setTimeLeft(selectedTime);
    }

    function handleTimeChange(event) {
        const value = Number(event.target.value);
        setSelectedTime(value);
        setTimeLeft(value);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    const progress = ((selectedTime - timeLeft) / selectedTime) * 100;

    return (
        <div className={styles.timer}>
            <div className={styles.header}>
                <div>
                    <span className={styles.icon} aria-hidden="true">Timer</span>
                    <h3>Descanso</h3>
                </div>

                <select
                    aria-label="Tempo de descanso"
                    disabled={isRunning}
                    value={selectedTime}
                    onChange={handleTimeChange}
                >
                    {REST_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option < 60 ? `${option}s` : `${option / 60} min`}
                        </option>
                    ))}
                </select>
            </div>

            <strong className={styles.time}>{formatTime(timeLeft)}</strong>
            <div
                className={styles.progress}
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax={selectedTime}
                aria-valuenow={selectedTime - timeLeft}
            >
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>

            <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                disabled={isRunning}
            >
                Reiniciar
            </button>
        </div>
    );
}

export default RestTimer;
