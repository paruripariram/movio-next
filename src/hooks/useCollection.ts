"use client";

import { useEffect, useState } from "react";
import type { collectionItem } from "@/types/collection";
import { getCollection } from "@/services/database/firebase/collectionService";

export default function useCollection(userId: string | undefined) {
    const [collectionArr, setCollectionArr] = useState<collectionItem[]>([]);
    const [loadedUserId, setLoadedUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const unsubscribe = getCollection(
            userId,
            (items) => {
                setCollectionArr(items);
                setLoadedUserId(userId);
            },
            (error) => {
                console.error("Error fetching collection: ", error.message);
                setLoadedUserId(userId);
            },
        );
        return () => unsubscribe();
    }, [userId]);

    const isLoadingCollection = !!userId && loadedUserId !== userId;

    return { collectionArr, isLoadingCollection };
}
