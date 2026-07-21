import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export async function loginGoogle() {
    const { user } = await signInWithPopup(
        auth,
        provider
    );

    return user;
}

export function logout() {
    return signOut(auth);
}

export function observeAuth(callback) {
    return onAuthStateChanged(
        auth,
        callback
    );
}