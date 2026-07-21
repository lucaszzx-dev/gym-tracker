import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

import * as repository from "../firebase/userRepository";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            const data = await repository.getOrCreate(
                user
            );

            setProfile(data);
            setLoading(false);
        }

        loadUser();
    }, [user]);

    async function updateProfile(data) {
        if (!user) {
            throw new Error(
                "Usuário não autenticado."
            );
        }

        await repository.update(
            user.uid,
            data
        );

        const updated =
            await repository.getById(
                user.uid
            );

        setProfile(updated);
    }

    const value = { profile, loading, updateProfile };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(
        UserContext
    );

    if (!context) {
        throw new Error(
            "useUser deve ser usado dentro de UserProvider."
        );
    }

    return context;
}
