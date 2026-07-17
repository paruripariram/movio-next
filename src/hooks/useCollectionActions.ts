"use client";

import { useEffect, useState } from "react";
import type {
    collectionItem,
    MovieDetails,
    SearchResult,
    TVDetails,
    User,
} from "../types";
import {
    addToCollection,
    checkMediaStatus,
    removeFromCollection,
} from "@/services/database/firebase/collectionService";
import { handleError } from "@/helpers/errorHandler";

export default function useCollectionActions(
    type: "movie" | "tv",
    details: MovieDetails | TVDetails | collectionItem | SearchResult | null,
    user: User | null,
) {
    type CollectionStatus = "watched" | "wishlist";
    const [status, setStatus] = useState<CollectionStatus | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [platform, setPlatform] = useState("");

    const userId = user?.id;
    const mediaId = details?.id;

    useEffect(() => {
        if (!userId || !mediaId) {
            return;
        }

        const unsubscribe = checkMediaStatus(userId, type, mediaId, (data) => {
            if (data) {
                setStatus(data.status);
                setPlatform(data.platform || "");
            } else {
                setStatus(null);
                setPlatform("");
            }
        });
        return () => unsubscribe();
    }, [userId, mediaId, type]);

    const handleAddToCollection = async (
        collectionType: "watched" | "wishlist",
        incomingPlatformId?: string,
    ) => {
        if (isPending) return false;
        if (!user || !user.id) {
            return false;
        }
        if (!details) return false;
        setIsPending(true);
        const previousStatus = status;
        setStatus(collectionType);
        setPlatform(incomingPlatformId || "");

        const movieData: collectionItem = {
            id: details.id,
            title:
                "title" in details && details.title
                    ? details.title
                    : "name" in details && details.name
                      ? details.name
                      : "",
            genre_ids:
                "genres" in details
                    ? details.genres.map((genre) => genre.id)
                    : details && "genre_ids" in details
                      ? details.genre_ids
                      : [],
            poster_path: details.poster_path,
            vote_average: details.vote_average,
            release_date:
                ("release_date" in details ? details.release_date : null) ??
                ("first_air_date" in details ? details.first_air_date : null) ??
                "",
            type: type,
            status: collectionType,
            ...(incomingPlatformId && { platform: incomingPlatformId }),
        };

        try {
            await addToCollection(user.id, type, details.id, movieData);
            return true;
        } catch (error) {
            handleError(error, "Error adding to collection:", {
                setErrorCallback: setError,
            });
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
        const previousPlatform = platform;
        setStatus(null);
        setPlatform("");

        try {
            await removeFromCollection(user.id, type, details.id);
            return true;
        } catch (error) {
            handleError(error, "Error removing from collection:", {
                setErrorCallback: setError,
            });
            setStatus(previousStatus);
            setPlatform(previousPlatform);
            return false;
        } finally {
            setIsPending(false);
        }
    };
    return {
        status,
        platform,
        isPending,
        error,
        handleAddToCollection,
        handleRemoveFromCollection,
    };
}
