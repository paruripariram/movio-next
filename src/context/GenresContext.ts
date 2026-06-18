'use client'


import { createContext, useContext } from "react";
import type { GenresMap } from "@/types";

interface GenresContextType {
    genresMap: GenresMap;
}

export const GenresContext = createContext<GenresContextType | undefined>(undefined);

export function useGenresContext() {
    const context = useContext(GenresContext);
    if(context === undefined) {
        throw new Error("useGenresContext must be used within a GenresProvider");
    }

    return context;
}