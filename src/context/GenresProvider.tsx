'use client'

import { useEffect, useState } from "react";
import type { GenresMap } from "../types";
import { getMovieGenres, getTvGenres } from "@/services/tmdb/movieService";
import { GenresContext } from "./GenresContext";

interface GenresProviderProps {
    children: React.ReactNode;
}

export function GenresProvider({ children }: GenresProviderProps) {
    const [genresMap, setGenresMap] = useState<GenresMap>({ movieGenres: {}, tvGenres: {} });

    useEffect(() => {
        const getGenres = async () => {
            try {
                const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()]);
                setGenresMap({ movieGenres, tvGenres });
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        getGenres();
    }, []);
    
    return (
        <GenresContext.Provider value={{ genresMap }}>
            {children}
        </GenresContext.Provider>
    );
}
