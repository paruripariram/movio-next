'use client'

import { useEffect, useState } from "react";
import type { GenresMap } from "../types";
import { getMovieGenres, getTvGenres } from "@/services/tmdb/movieService";
import { GenresContext } from "./GenresContext";
import { handleError } from "@/helpers/errorHandler";

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
                handleError(error, "Error fetching genres:")
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
