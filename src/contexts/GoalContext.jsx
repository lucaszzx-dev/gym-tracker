import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

import * as repository from "../firebase/goalRepository";

const GoalContext = createContext(null);

export function GoalProvider({ children }) {
    const { user } = useAuth();

    const [goal, setGoal] = useState(null);

    useEffect(() => {
        if (!user) {
            setGoal(null);
            return undefined;
        }

        const unsubscribe = repository.subscribe(
            user.uid,
            setGoal
        );

        return unsubscribe;
    }, [user]);

    async function saveGoal(goalValue) {
        if (!user) {
            throw new Error(
                "Usuário não autenticado."
            );
        }

        await repository.save(
            user.uid,
            goalValue
        );
    }

    const value = { goal, saveGoal };

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    );
}

export function useGoal() {
    const context = useContext(
        GoalContext
    );

    if (!context) {
        throw new Error(
            "useGoal deve ser usado dentro de GoalProvider."
        );
    }

    return context;
}
