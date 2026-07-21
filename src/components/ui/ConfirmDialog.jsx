import { useEffect, useRef } from "react";
import styles from "./ConfirmDialog.module.css";

function ConfirmDialog({ open, title, description, confirmLabel = "Confirmar", busy = false, onConfirm, onCancel }) {
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        cancelRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !busy) onCancel();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, busy, onCancel]);

    if (!open) return null;

    return (
        <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onCancel()}>
            <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
                <span className={styles.eyebrow}>Confirmação necessária</span>
                <h2 id="dialog-title">{title}</h2>
                <p id="dialog-description">{description}</p>
                <div className={styles.actions}>
                    <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy}>Cancelar</button>
                    <button type="button" className={styles.danger} onClick={onConfirm} disabled={busy}>
                        {busy ? "Processando..." : confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default ConfirmDialog;
