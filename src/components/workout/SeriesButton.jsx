import styles from "./SeriesButton.module.css";

function SeriesButton({
    status,
    currentSet,
    onClick,
}) {
    function getButtonText() {
        switch (status) {
            case "resting":
                return "Descansando...";

            case "ready":
                return "Próxima série";

            case "completed":
                return "Exercício concluído";

            default:
                return `Concluir série ${currentSet}`;
        }
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={status === "resting" || status === "completed"}
            className={`
                ${styles.button}
                ${status === "completed" ? styles.completed : ""}
            `}
        >
            {getButtonText()}
        </button>
    );
}

export default SeriesButton;
