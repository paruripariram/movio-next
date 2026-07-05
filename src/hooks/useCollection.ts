"use client";

import { useEffect, useState } from "react";
import type { collectionItem } from "@/types/collection";
import { getCollection } from "@/services/database/firebase/collectionService";
import { handleError } from "@/helpers/errorHandler";

export default function useCollection(userId: string | undefined) {
    const [criticalError, setCriticalError] = useState<Error | null>(null);
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
                setCriticalError(null);
            },
            (error) => {
                const isCanceled = handleError(error, "Ошибка загрузки коллекции");
                setLoadedUserId(userId);
                if(isCanceled) return;
                setCriticalError(error);
            },
        );
        return () => unsubscribe();
    }, [userId]);

    const collectionArr = userId ? rawCollectionArr : [];
    const isLoadingCollection = !!userId && loadedUserId !== userId;

    return { collectionArr, isLoadingCollection, criticalError };
}
