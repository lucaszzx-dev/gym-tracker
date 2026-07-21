import styles from "./PageSkeleton.module.css";

function PageSkeleton() {
    return <div className={styles.page} role="status" aria-label="Carregando página"><div className={styles.hero} /><div className={styles.grid}><div /><div /><div /></div></div>;
}

export default PageSkeleton;
