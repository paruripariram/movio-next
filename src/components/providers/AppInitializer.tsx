"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useCollectionStore } from "@/store/collectionStore";
import { useGenresStore } from "@/store/genreStore";

export function AppInitializer() {
    const { user } = useAuthContext();
    const subscribeToCollection = useCollectionStore(
        (state) => state.subscribeToCollection,
    );
    const clearCollection = useCollectionStore(
        (state) => state.clearCollection,
    );
    const fetchGenres = useGenresStore((state) => state.fetchGenres);

    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    useEffect(() => {
        if (user?.id) {
            subscribeToCollection(user.id);
        } else {
            clearCollection();
        }
        return () => {
            clearCollection();
        };
    }, [user?.id, subscribeToCollection, clearCollection]);

    return null;
}
