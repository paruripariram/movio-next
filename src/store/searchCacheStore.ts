import { SearchResult } from "@/types";
import { create } from "zustand";

interface SearchCacheState {
    cachedResults: SearchResult[];
    cachedPage: number;
    cachedHasMore: boolean;
    cachedHasSearched: boolean;
    lastQuery: string;
    lastType: "movie" | "tv" | "";
    lastGenres: string;
    cachedScrollY: number;
    setCache: (state: Partial<SearchCacheState>) => void;
    clearCache: () => void;
}

export const useSearchCacheStore = create<SearchCacheState>((set) => ({
    cachedResults: [],
    cachedPage: 1,
    cachedHasMore: true,
    cachedHasSearched: false,
    lastQuery: "",
    lastType: "",
    lastGenres: "",
    cachedScrollY: 0,
    setCache: (newState) => set((state) => ({ ...state, ...newState })),
    clearCache: () =>
        set({
            cachedResults: [],
            cachedPage: 1,
            cachedHasMore: true,
            cachedHasSearched: false,
            lastQuery: "",
            lastType: "",
            lastGenres: "",
            cachedScrollY: 0,
        }),
}));
