"use client";

import { useEffect, useState } from "react";
import type { collectionItem } from "@/types/collection";
import {getCollection} from "@/services/database/firebase/collectionService";

export default function useCollection(userId: string | undefined) {
    const [collectionArr, setCollectionArr] = useState<collectionItem[]>([]);
    const [isLoadingCollection, setIsLoadingCollection] = useState(true);

    const [prevUserId, setPrevUserId] = useState<string | undefined>(userId);

    if (userId !== prevUserId) {
        setPrevUserId(userId);
        if (!userId) {
            setCollectionArr([]);
            setIsLoadingCollection(false);
        } else {
            setIsLoadingCollection(true);
        }
    }

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = getCollection(
            userId,
            (items) => {
                setCollectionArr(items);
                setIsLoadingCollection(false);
            },
            (error) => {
                console.error("Error fetching collection: ", error.message);
                setIsLoadingCollection(false);
            },
        );
        return () => unsubscribe();
    }, [userId]);

    return { collectionArr, isLoadingCollection };
}
