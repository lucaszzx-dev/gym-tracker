import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    HiArrowRightOnRectangle,
    HiChartBar,
    HiClipboardDocumentList,
    HiHome,
    HiMoon,
    HiSun,
    HiUser,
} from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { ACTIVE_WORKOUT_EVENT, getActiveWorkout } from "../../services/activeWorkoutStorage";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
    { to: "/", label: "Início", icon: HiHome, end: true },
    { to: "/workouts", label: "Treinos", icon: HiClipboardDocumentList },
    { to: "/progress", label: "Evolução", icon: HiChartBar },
];

function Navbar() {
    const { user, signOutUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeWorkout, setActiveWorkout] = useState(() => getActiveWorkout());
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const update = () => setActiveWorkout(getActiveWorkout());
        window.addEventListener(ACTIVE_WORKOUT_EVENT, update);
        window.addEventListener("storage", update);
        return () => {
            window.removeEventListener(ACTIVE_WORKOUT_EVENT, update);
            window.removeEventListener("storage", update);
        };
    }, []);

    async function handleSignOut() {
        setMenuOpen(false);
        await signOutUser();
    }

    const avatar = user.photoURL ? (
        <img src={user.photoURL} alt={user.displayName || "Perfil"} className={styles.avatar} />
    ) : (
        <span className={styles.avatarFallback}>{(user.displayName || user.email || "U")[0].toUpperCase()}</span>
    );

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.navbar} aria-label="Navegação principal">
                    <Link to="/" className={styles.logo} aria-label="Gym Tracker, início">
                        <span className={styles.logoMark}>GT</span>
                        <span>Gym Tracker</span>
                    </Link>

                    <div className={styles.desktopNav}>
                        {NAV_ITEMS.map(({ to, label, end }) => (
                            <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? styles.activeLink : undefined}>{label}</NavLink>
                        ))}
                    </div>

                    <div className={styles.actions}>
                        {activeWorkout && (
                            <Link to={`/workouts/${activeWorkout.workoutId}`} className={styles.activeWorkout}>
                                <span className={styles.liveDot} />
                                Treino ativo
                            </Link>
                        )}
                        <button type="button" className={styles.iconButton} onClick={toggleTheme} aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}>
                            {theme === "dark" ? <HiSun /> : <HiMoon />}
                        </button>
                        <div className={styles.userMenu} ref={menuRef}>
                            <button type="button" className={styles.avatarButton} onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-label="Abrir menu do perfil">{avatar}</button>
                            {menuOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.userInfo}><strong>{user.displayName || "Usuário"}</strong><small>{user.email}</small></div>
                                    <Link to="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}><HiUser /> Perfil</Link>
                                    <button type="button" className={styles.dropdownLogout} onClick={handleSignOut}><HiArrowRightOnRectangle /> Sair</button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <nav className={styles.mobileNav} aria-label="Navegação mobile">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? styles.mobileActive : undefined}><Icon /><span>{label}</span></NavLink>
                ))}
                <NavLink to="/profile" className={({ isActive }) => isActive ? styles.mobileActive : undefined}><HiUser /><span>Perfil</span></NavLink>
            </nav>
        </>
    );
}

export default Navbar;
