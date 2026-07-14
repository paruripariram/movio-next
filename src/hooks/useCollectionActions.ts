"use client";

import { useEffect, useState } from "react";
import type { MovieDetails, TVDetails, User } from "../types";
import {
    addToCollection,
    checkMediaStatus,
    removeFromCollection,
} from "@/services/database/firebase/collectionService";
import { handleError } from "@/helpers/errorHandler";

export default function useCollectionActions(
    type: "movie" | "tv",
    details: MovieDetails | TVDetails | null,
    user: User | null,
) {
    type CollectionStatus = "watched" | "wishlist";
    const [status, setStatus] = useState<CollectionStatus | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userId = user?.id;
    const mediaId = details?.id;

    useEffect(() => {
        if (!userId || !mediaId) {
            return;
        }

        const unsubscribe = checkMediaStatus(userId, type, mediaId, setStatus);
        return () => unsubscribe();
    }, [userId, mediaId, type]);

    const handleAddToCollection = async (
        collectionType: "watched" | "wishlist", platformId?: string
    ) => {
        if (isPending) return false;
        if (!user || !user.id) {
            return false;
        }
        if (!details) return false;
        setIsPending(true);
        const previousStatus = status;
        setStatus(collectionType);

        const movieData = {
            id: details.id,
            title: "title" in details ? details.title : details.name,
            genre_ids: details.genres.map((genre) => genre.id),
            poster_path: details.poster_path,
            vote_average: details.vote_average,
            type: type,
            status: collectionType,
            ...(platformId && { platform: platformId }),
        };

        try {
            await addToCollection(user.id, type, details.id, movieData);
            return true;
        } catch (error) {
            handleError(error, "Error adding to collection:", {setErrorCallback: setError});
            setStatus(previousStatus);
            return false;
        } finally {
            setIsPending(false);
        }
    };

    const handleRemoveFromCollection = async () => {
        if (isPending) return false;
        if (!user || !user.id) {
            return false;
        }
        if (!details) return false;
        setIsPending(true);
        const previousStatus = status;
        setStatus(null);

        try {
            await removeFromCollection(user.id, type, details.id);
            return true;
        } catch (error) {
            handleError(error, "Error removing from collection:", {setErrorCallback: setError});
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
