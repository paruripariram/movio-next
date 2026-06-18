'use client'

import { useEffect, useState } from "react";
import type { MovieDetails, TVDetails } from "../types";
import type { firebaseUser } from "../types/firebaseUser";
import { db } from "@/config/firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default function useCollectionActions(
    type: "movie" | "tv",
    details: MovieDetails | TVDetails | null,
    user: firebaseUser | null,
) {
    type CollectionStatus = "watched" | "wishlist";
    const [status, setStatus] = useState<CollectionStatus | null>(null);
    const [isPending, setIsPending] = useState(false);

    const userId = user?.uid;
    const mediaId = details?.id;

    useEffect(() => {
        if (!userId || !mediaId) {
            return;
        }

        const docRef = doc(
            db,
            "users",
            userId,
            "collection",
            `${type}-${mediaId}`,
        );
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
        return () => unsubscribe();
    }, [userId, mediaId, type]);

    const handleAddToCollection = async (
        collectionType: "watched" | "wishlist",
    ) => {
        if (isPending) return false;
        if (!user) {
            return false;
        }
        if (!details) return false;
        setIsPending(true);
        const previousStatus = status;
        setStatus(collectionType);

        const movieData = {
            id: details.id,
            title: "title" in details ? details.title : details.name,
            genres: details.genres.map((genre) => genre.name),
            poster_path: details.poster_path,
            vote_average: details.vote_average,
            type: type,
            status: collectionType,
        };

        try {
            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid,
                    "collection",
                    `${type}-${details.id}`,
                ),
                movieData,
            );
            return true;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error adding to collection: ", error.message);
            }
            setStatus(previousStatus);
            return false;
        } finally {
            setIsPending(false);
        }
    };

    const handleRemoveFromCollection = async () => {
        if (isPending) return false;
        if (!user) {
            return false;
        }
        if (!details) return false;
        setIsPending(true);
        const previousStatus = status;
        setStatus(null);

        try {
            await deleteDoc(
                doc(
                    db,
                    "users",
                    user.uid,
                    "collection",
                    `${type}-${details.id}`,
                ),
            );
            return true;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    "Error removing from collection: ",
                    error.message,
                );
            }
            setStatus(previousStatus);
            return false;
        } finally {
            setIsPending(false);
        }
    };
    return {
        status,
        isPending,
        handleAddToCollection,
        handleRemoveFromCollection,
    };
}
