import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "history";

const historyCollection =
    collection(db, COLLECTION);

export async function getAll(userId) {
    const q = query(
        historyCollection,
        where("userId", "==", userId),
        orderBy("completedAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function create(userId, workout) {
    const data = {
        userId,
        workoutId: workout.id,
        workoutName: workout.name,
        muscle: workout.muscle,
        exercisesCount:
            workout.exercises.length,
        completedAt:
            new Date().toISOString(),
    };

    const reference = await addDoc(
        historyCollection,
        data
    );

    return {
        id: reference.id,
        ...data,
    };
}

export function subscribe(
    userId,
    callback
) {
    const q = query(
        historyCollection,
        where("userId", "==", userId),
        orderBy("completedAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        callback(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
        );
    });
}