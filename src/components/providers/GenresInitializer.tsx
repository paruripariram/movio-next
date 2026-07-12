"use client";

import { useEffect } from "react";
import { useGenresStore } from "@/store/genreStore";

export function GenresInitializer({ children }: { children: React.ReactNode }) {
    const fetchGenres = useGenresStore((state) => state.fetchGenres);
    
    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    return <>{children}</>;
}