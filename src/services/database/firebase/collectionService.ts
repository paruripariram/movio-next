import { db } from "@/config/firebase";
import { collectionItem } from "@/types";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

export function getCollection(
    userId: string,
    onData: (items: collectionItem[]) => void,
    onError: (error: Error) => void,
) {
    const collectionRef = collection(db, "users", userId, "collection");
    const unsubscribe = onSnapshot(
        collectionRef,
        (querySnapshot) => {
            const items: collectionItem[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.type === "movie" || data.type === "tv") {
                    items.push(data as collectionItem);
                }
            });
            onData(items);
        },
        (error) => onError(error),
    );
    return unsubscribe;
}

export function checkMediaStatus(
    userId: string,
    type: "movie" | "tv",
    mediaId: number,
    setStatus: (status: "watched" | "wishlist" | null) => void,
) {
    const docRef = doc(db, "users", userId, "collection", `${type}-${mediaId}`);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.status === "watched" || data.status === "wishlist") {
                setStatus(data.status);
            } else {
                setStatus(null);
            }
        } else {
            setStatus(null);
        }
    });
    return unsubscribe;
}

export async function removeFromCollection(
    userId: string,
    type: "movie" | "tv",
    mediaId: number,
) {
    await deleteDoc(
        doc(db, "users", userId, "collection", `${type}-${mediaId}`),
    );
}

export async function addToCollection(
    userId: string,
    type: "movie" | "tv",
    mediaId: number,
    movieData: collectionItem,
) {
    await setDoc(
        doc(db, "users", userId, "collection", `${type}-${mediaId}`),
        movieData,
    );
}
