"use client";

import { useState } from "react";
import type {
    collectionItem,
    MovieDetails,
    PersonCreditItem,
    SearchResult,
    TVDetails,
    User,
} from "../types";
import {
    addToCollection,
    removeFromCollection,
} from "@/services/db/collection.service";
import { handleError } from "@/helpers/errorHandler";
import { useCollectionStore } from "@/store/collectionStore";

export default function useCollectionActions(
    type: "movie" | "tv",
    details:
        | MovieDetails
        | TVDetails
        | collectionItem
        | SearchResult
        | PersonCreditItem
        | null,
    user: User | null,
) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upsertLocalItem = useCollectionStore(
        (state) => state.upsertLocalItem,
    );
    const removeLocalItem = useCollectionStore(
        (state) => state.removeLocalItem,
    );

    const userId = user?.id;
    const mediaId = details?.id;

    const currentItem = useCollectionStore((state) =>
        state.collectionArr.find(
            (item) => item.id === mediaId && item.type === type,
        ),
    );
    const status = currentItem?.status || null;
    const platform = currentItem?.platform || "";

    const handleAddToCollection = async (
        collectionType: "watched" | "wishlist",
        incomingPlatformId?: string,
    ) => {
        if (isPending) return false;
        if (!user || !userId) {
            return false;
        }
        if (!details) return false;

        const previosItem = currentItem;

        setIsPending(true);

        const now = new Date().toISOString();

        const movieData: collectionItem = {
            id: details.id,
            title:
                "title" in details && details.title
                    ? details.title
                    : "name" in details && details.name
                      ? details.name
                      : "",
            genre_ids:
                "genres" in details && details.genres
                    ? details.genres.map((genre) => genre.id)
                    : "genre_ids" in details && details.genre_ids
                      ? details.genre_ids
                      : [],
            poster_path: details.poster_path,
            vote_average: details.vote_average ?? 0,
            release_date:
                ("release_date" in details ? details.release_date : null) ??
                ("first_air_date" in details ? details.first_air_date : null) ??
                "",
            type: type,
            status: collectionType,
            ...(incomingPlatformId && { platform: incomingPlatformId }),
            addedAt: now,
            watchedAt: collectionType === "watched" ? now : null,
        };

        try {
            upsertLocalItem(movieData);
            await addToCollection(user.id, type, details.id, movieData);
            return true;
        } catch (error) {
            handleError(error, "Error adding to collection:", {
                setErrorCallback: setError,
            });
            if (previosItem) upsertLocalItem(previosItem);
            else removeLocalItem(details.id, type);
            return false;
        } finally {
            setIsPending(false);
        }
    };

    const handleRemoveFromCollection = async () => {
        if (isPending) return false;
        if (!user || !userId) {
            return false;
        }
        if (!details) return false;

        const previosItem = currentItem;

        setIsPending(true);

        try {
            removeLocalItem(details.id, type);
            await removeFromCollection(user.id, type, details.id);
            return true;
        } catch (error) {
            handleError(error, "Ошибка при удалении из коллекции:", {
                setErrorCallback: setError,
            });
            if (previosItem) upsertLocalItem(previosItem);
            else removeLocalItem(details.id, type);
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
