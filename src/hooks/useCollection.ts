"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { collectionItem } from "@/types/collection";
import { unsubscribe } from "diagnostics_channel";

export default function useCollection(userId: string | undefined) {
    const [collectionArr, setCollectionArr] = useState<collectionItem[]>([]);
    const [isLoadingCollection, setIsLoadingCollection] = useState(true);

    useEffect(() => {
        async function fetchCollection() {
            if (!userId) {
                setCollectionArr([]);
                return;
            }
            const collectionRef = collection(db, "users", userId, "collection");
            try {
                setIsLoadingCollection(true);
                // await getDocs(collectionRef).then((querySnapshot) => {
                //     console.log(querySnapshot);
                //     const items: collectionItem[] = [];
                //     querySnapshot.forEach((doc) => {
                //         const data = doc.data();
                //         if (data.type === "movie" || data.type === "tv") {
                //             items.push(data as collectionItem);
                //         }
                //     });
                //     setCollectionArr(items);
                //     setIsLoadingCollection(false);
                //     console.log(items);
                // });
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
                        setCollectionArr(items);
                        setIsLoadingCollection(false);
                    },
                );
                return () => unsubscribe();
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error fetching collection: ", error.message);
                    setIsLoadingCollection(false);
                }
            }
        }
        fetchCollection();
    }, [userId]);

    return { collectionArr, isLoadingCollection };
}
