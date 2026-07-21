import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "weights";

const weightsCollection = collection(
    db,
    COLLECTION
);

const weightRef = (id) =>
    doc(db, COLLECTION, id);

const mapWeight = (snapshot) => {
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

export async function create(userId, weight) {
    const data = {
        userId,
        weight: Number(weight),
        createdAt: serverTimestamp(),
    };

    const reference = await addDoc(
        weightsCollection,
        data
    );

    return {
        id: reference.id,
        ...data,
    };
}

export async function remove(id) {
    await deleteDoc(weightRef(id));
}

export async function getAll(userId) {
    const q = query(
        weightsCollection,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapWeight);
}

export function subscribe(
    userId,
    callback
) {
    const q = query(
        weightsCollection,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        callback(
            snapshot.docs.map(mapWeight)
        );
    });
}
