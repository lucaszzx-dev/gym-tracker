import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "users";

const userRef = (uid) =>
    doc(db, COLLECTION, uid);

export async function getById(uid) {
    const snapshot = await getDoc(
        userRef(uid)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
}

export async function getOrCreate(user) {
    const snapshot = await getDoc(
        userRef(user.uid)
    );

    if (snapshot.exists()) {
        return {
            id: snapshot.id,
            ...snapshot.data(),
        };
    }

    const profile = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
    };

    await setDoc(
        userRef(user.uid),
        profile
    );

    return profile;
}

export async function update(uid, data) {
    await updateDoc(
        userRef(uid),
        data
    );
}