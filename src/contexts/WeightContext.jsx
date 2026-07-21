import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

import * as repository from "../firebase/weightRepository";

const WeightContext = createContext(null);

export function WeightProvider({ children }) {
    const { user } = useAuth();

    const [weights, setWeights] = useState([]);

    useEffect(() => {
        if (!user) {
            setWeights([]);
            return undefined;
        }

        const unsubscribe = repository.subscribe(
            user.uid,
            setWeights
        );

        return unsubscribe;
    }, [user]);

    async function saveWeight(weight) {
        if (!user) {
            throw new Error(
                "Usuário não autenticado."
            );
        }

        await repository.create(
            user.uid,
            weight
        );
    }

    async function deleteWeight(id) {
        await repository.remove(id);
    }

    const value = { weights, saveWeight, deleteWeight };

    return (
        <WeightContext.Provider value={value}>
            {children}
        </WeightContext.Provider>
    );
}

export function useWeight() {
    const context = useContext(
        WeightContext
    );

    if (!context) {
        throw new Error(
            "useWeight deve ser usado dentro de WeightProvider."
        );
    }

    return context;
}
