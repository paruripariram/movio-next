"use client";

import { useEffect, useState } from "react";
import type { collectionItem } from "@/types/collection";
import { getCollection } from "@/services/database/firebase/collectionService";
import { handleError } from "@/helpers/errorHandler";

export default function useCollection(userId: string | undefined) {
    const [error, setError] = useState<string | null>(null);
    const [rawCollectionArr, setRawCollectionArr] = useState<collectionItem[]>([]);
    const [loadedUserId, setLoadedUserId] = useState<string | undefined>(
        undefined,
    );

    useEffect(() => {
        if (!userId) {
            return;
        }

        const unsubscribe = getCollection(
            userId,
            (items) => {
                setRawCollectionArr(items);
                setLoadedUserId(userId);
            },
            (error) => {
                handleError(error, "Error fetching collection:", setError);
                setLoadedUserId(userId);
            },
        );
        return () => unsubscribe();
    }, [userId]);

    const collectionArr = userId ? rawCollectionArr : [];
    const currentError = userId ? error : null;
    const isLoadingCollection = !!userId && loadedUserId !== userId;

    return { collectionArr, isLoadingCollection, error: currentError };
}
