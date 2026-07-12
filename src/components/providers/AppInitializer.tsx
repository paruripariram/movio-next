"use client";

import React, { useEffect } from "react";
import { useCollectionStore } from "@/store/collectionStore";
import { useGenresStore } from "@/store/genreStore";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

export function AppInitializer({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    const setUser = useAuthStore((state) => state.setUser);
    const setIsLoadingUser = useAuthStore((state) => state.setIsLoadingUser);

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
        if (status === "loading") {
            setIsLoadingUser(true);
            return;
        }

        setIsLoadingUser(false);

        if (status === "authenticated" && session?.user) {
            setUser({
                id: session.user.id ?? "guest",
                name: session.user.name ?? "Guest",
                email: session.user.email ?? null,
                image: session.user.image ?? null,
            });
            subscribeToCollection(session.user.id!);
        } else {
            setUser(null);
            clearCollection();
        }
        return () => {
            clearCollection();
        };
    }, [
        status,
        session?.user,
        setUser,
        subscribeToCollection,
        clearCollection,
        setIsLoadingUser,
    ]);

    return <>{children}</>;
}
