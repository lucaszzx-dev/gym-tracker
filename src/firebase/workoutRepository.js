import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "workouts";

const workoutsCollection = collection(db, COLLECTION);

const workoutRef = (id) =>
    doc(db, COLLECTION, id);

const mapWorkout = (snapshot) => {
    const data = snapshot.data();
    const createdAt = data.createdAt?.toDate?.() ?? data.createdAt;

    return {
        id: snapshot.id,
        ...data,
        createdAt: createdAt instanceof Date
            ? createdAt.toISOString()
            : createdAt,
    };
};

export async function getAll(userId) {
    const q = query(
        workoutsCollection,
        where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapWorkout);
}

export async function getById(id) {
    const snapshot = await getDoc(
        workoutRef(id)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return mapWorkout(snapshot);
}

export async function create(userId, workout) {
    const data = {
        userId,
        name: workout.name,
        muscle: workout.muscle,
        exercises: [],
        createdAt: serverTimestamp(),
    };

    const reference = await addDoc(
        workoutsCollection,
        data
    );

    return {
        id: reference.id,
        ...data,
    };
}

export async function duplicate(workoutId) {
    const workout = await getById(workoutId);

    if (!workout) {
        throw new Error(
            "Treino não encontrado."
        );
    }

    const duplicatedExercises =
        workout.exercises.map((exercise) => ({
            ...exercise,
            id: crypto.randomUUID(),
        }));

    await addDoc(workoutsCollection, {
        userId: workout.userId,
        name: `${workout.name} (Cópia)`,
        muscle: workout.muscle,
        exercises: duplicatedExercises,
        createdAt: serverTimestamp(),
    });
}

export async function update(id, data) {
    await updateDoc(
        workoutRef(id),
        data
    );
}

export async function remove(id) {
    await deleteDoc(
        workoutRef(id)
    );
}

export async function addExercise(
    workoutId,
    exercise
) {
    const workout = await getById(workoutId);

    if (!workout) {
        throw new Error(
            "Treino não encontrado."
        );
    }

    const exercises = [
        ...(workout.exercises ?? []),

        {
            id: crypto.randomUUID(),
            ...exercise,
            createdAt: Date.now(),
        },
    ];

    await update(workoutId, {
        exercises,
    });
}

export async function updateExercise(
    workoutId,
    exerciseId,
    data
) {
    const workout = await getById(workoutId);

    if (!workout) {
        throw new Error(
            "Treino não encontrado."
        );
    }

    const exercises =
        workout.exercises.map(
            (exercise) =>
                exercise.id === exerciseId
                    ? {
                          ...exercise,
                          ...data,
                      }
                    : exercise
        );

    await update(workoutId, {
        exercises,
    });
}

export async function deleteExercise(
    workoutId,
    exerciseId
) {
    const workout = await getById(workoutId);

    if (!workout) {
        throw new Error(
            "Treino não encontrado."
        );
    }

    const exercises =
        workout.exercises.filter(
            (exercise) =>
                exercise.id !== exerciseId
        );

    await update(workoutId, {
        exercises,
    });
}

export function subscribe(
    userId,
    callback
) {
    const q = query(
        workoutsCollection,
        where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
        callback(
            snapshot.docs.map(mapWorkout)
        );
    });
}
