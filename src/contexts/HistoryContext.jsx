import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

import * as repository from "../firebase/historyRepository";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
    const { user } = useAuth();

    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!user) {
            setHistory([]);
            return undefined;
        }

        const unsubscribe = repository.subscribe(
            user.uid,
            setHistory
        );

        return unsubscribe;
    }, [user]);

    async function completeWorkout(workout) {
        if (!user) {
            throw new Error(
                "Usuário não autenticado."
            );
        }

        await repository.create(
            user.uid,
            workout
        );
    }

    const value = { history, completeWorkout };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(
        HistoryContext
    );

    if (!context) {
        throw new Error(
            "useHistory deve ser usado dentro de HistoryProvider."
        );
    }

    return context;
}
