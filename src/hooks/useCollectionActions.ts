"use client";

import { useEffect, useState } from "react";
import type { MovieDetails, TVDetails } from "../types";
import type { firebaseUser } from "../types/firebaseUser";
import {
    addToCollection,
    checkMediaStatus,
    removeFromCollection,
} from "@/services/database/firebase/collectionService";
import { handleError } from "@/helpers/errorHandler";

export default function useCollectionActions(
    type: "movie" | "tv",
    details: MovieDetails | TVDetails | null,
    user: firebaseUser | null,
) {
    type CollectionStatus = "watched" | "wishlist";
    const [status, setStatus] = useState<CollectionStatus | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userId = user?.uid;
    const mediaId = details?.id;

    useEffect(() => {
        if (!userId || !mediaId) {
            return;
        }

        const unsubscribe = checkMediaStatus(userId, type, mediaId, setStatus);
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
            await addToCollection(user.uid, type, details.id, movieData);
            return true;
        } catch (error) {
            handleError(error, "Error adding to collection:", setError);
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
            await removeFromCollection(user.uid, type, details.id);
            return true;
        } catch (error) {
            handleError(error, "Error removing from collection:", setError);
            setStatus(previousStatus);
            return false;
        } finally {
            setIsPending(false);
        }
    };
    return {
        status,
        isPending,
        error,
        handleAddToCollection,
        handleRemoveFromCollection,
    };
}
