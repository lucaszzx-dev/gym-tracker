import {
    doc,
    getDoc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "goals";

const goalRef = (userId) =>
    doc(db, COLLECTION, userId);

export async function save(userId, goal) {
    await setDoc(goalRef(userId), {
        userId,
        goal: Number(goal),
    });
}

export async function get(userId) {
    const snapshot = await getDoc(
        goalRef(userId)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data().goal;
}

export function subscribe(
    userId,
    callback
) {
    return onSnapshot(
        goalRef(userId),
        (snapshot) => {
            if (!snapshot.exists()) {
                callback(null);
                return;
            }

            callback(snapshot.data().goal);
        }
    );
}