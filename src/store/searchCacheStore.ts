import { SearchResult } from "@/types";
import { create } from "zustand";

interface SearchCacheState {
    cachedResults: SearchResult[];
    cachedPage: number;
    cachedHasMore: boolean;
    cachedHasSearched: boolean;
    lastQuery: string;
    lastType: "movie" | "tv" | "";
    lastWithGenres: string;
    lastWithoutGenres: string;
    lastReleaseDateGte: string;
    lastReleaseDateLte: string;
    lastVoteAverageGte: string;
    lastVoteAverageLte: string;
    lastSortBy: string;
    cachedScrollY: number;
    cachedCollectionScrollY: number;
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
    lastWithGenres: "",
    lastWithoutGenres: "",
    lastReleaseDateGte: "",
    lastReleaseDateLte: "",
    lastVoteAverageGte: "",
    lastVoteAverageLte: "",
    lastSortBy: "",
    cachedScrollY: 0,
    cachedCollectionScrollY: 0,
    setCache: (newState) => set((state) => ({ ...state, ...newState })),
    clearCache: () =>
        set((state) => ({
            cachedResults: [],
            cachedPage: 1,
            cachedHasMore: true,
            cachedHasSearched: false,
            lastQuery: "",
            lastType: "",
            lastWithGenres: "",
            lastWithoutGenres: "",
            lastReleaseDateGte: "",
            lastReleaseDateLte: "",
            lastVoteAverageGte: "",
            lastVoteAverageLte: "",
            lastSortBy: "",
            cachedScrollY: 0,
            cachedCollectionScrollY: state.cachedCollectionScrollY,
        })),
}));
