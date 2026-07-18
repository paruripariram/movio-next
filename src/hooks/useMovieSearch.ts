"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "../types";
import { search } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";
import { useSearchCacheStore } from "@/store/searchCacheStore";

export default function useMovieSearch(
    searchQuery: string,
    type: "movie" | "tv",
    genres: string,
) {
    const {
        cachedResults,
        cachedPage,
        cachedHasMore,
        cachedHasSearched,
        lastQuery,
        lastType,
        lastGenres,
        setCache,
        clearCache
    } = useSearchCacheStore();
    useEffect(() => {
        if (
            searchQuery !== lastQuery ||
            type !== lastType ||
            genres !== lastGenres
        ) {
            clearCache();
            setCache({
                lastQuery: searchQuery,
                lastType: type,
                lastGenres: genres,
                cachedScrollY: 0,
            });
        }
    }, [
        searchQuery,
        type,
        genres,
        lastQuery,
        lastType,
        lastGenres,
        clearCache,
        setCache,
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const isSameParams =
        searchQuery === lastQuery && type === lastType && genres === lastGenres;

    const [isInitialLoading, setIsInitialLoading] = useState(
        !isSameParams && cachedResults.length === 0,
    );

    const prevParams = useRef({ searchQuery, type, genres });

    const isFirstRender = useRef(true);

    useEffect(() => {
        const isFiltersChanged =
            prevParams.current.type !== type ||
            prevParams.current.genres !== genres ||
            prevParams.current.searchQuery !== searchQuery;

        if (isFiltersChanged) {
            setCache({
                cachedResults: [],
                cachedPage: 1,
                cachedHasMore: true,
                cachedHasSearched: false,
                lastQuery: searchQuery,
                lastType: type,
                lastGenres: genres,
            });
            setIsInitialLoading(true);
            prevParams.current = { searchQuery, type, genres };

            if (cachedPage !== 1) return;
        }

        const currentStore = useSearchCacheStore.getState();

        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (isSameParams && currentStore.cachedResults.length > 0) {
                const savedScrollY = useSearchCacheStore.getState().cachedScrollY;
                if(savedScrollY > 0) {
                    setTimeout(() => {
                        window.scrollTo({ top: savedScrollY, behavior: "instant" });
                    },50)
                }
                return;
            }
        }

        async function fetchResults(signal: AbortSignal) {
            setIsDebouncing(false);
            setError(null);
            setIsLoading(true);
            try {
                const query = searchQuery.trim();
                const data = await search({
                    query,
                    page: cachedPage,
                    type,
                    genres,
                    signal,
                });

                const currentResults =
                    useSearchCacheStore.getState().cachedResults;

                if (cachedPage === 1) {
                    setCache({ cachedResults: data.results });
                } else {
                    const seenIds = new Set(
                        currentResults.map((item) => item.id),
                    );
                    const uniqueNewResults = data.results.filter(
                        (item: SearchResult) => !seenIds.has(item.id),
                    );
                    setCache({
                        cachedResults: [...currentResults, ...uniqueNewResults],
                    });
                }
                setCache({
                    cachedHasMore: cachedPage < data.total_pages,
                    cachedHasSearched: true,
                });
                setError(null);
            } catch (error) {
                handleError(error, "Error fetching search results:", {
                    setErrorCallback: setError,
                });
            } finally {
                setIsLoading(false);
                setIsInitialLoading(false);
            }
        }

        let debounceTimeout: ReturnType<typeof setTimeout>;
        let debounceStartTimeout: ReturnType<typeof setTimeout>;

        const abortController = new AbortController();
        const signal = abortController.signal;
        if (
            cachedPage === 1 &&
            useSearchCacheStore.getState().cachedResults.length === 0
        ) {
            debounceStartTimeout = setTimeout(() => {
                setIsDebouncing(true);
            }, 0);
            debounceTimeout = setTimeout(() => {
                fetchResults(signal);
            }, 500);
        } else {
            fetchResults(signal);
        }
        return () => {
            clearTimeout(debounceTimeout);
            clearTimeout(debounceStartTimeout);
            abortController.abort();
        };
    }, [
        searchQuery,
        cachedPage,
        retryCount,
        type,
        genres,
        lastQuery,
        lastType,
        lastGenres,
        isSameParams,
        setCache,
    ]);

    const handleSetPage = (
        nextPageParam: number | ((prev: number) => number),
    ) => {
        const nextPage =
            typeof nextPageParam === "function"
                ? nextPageParam(cachedPage)
                : nextPageParam;
        setCache({ cachedPage: nextPage });
    };

    return {
        page: cachedPage,
        searchResults: useSearchCacheStore().cachedResults,
        isLoading,
        error,
        setError,
        isDebouncing,
        setPage: handleSetPage,
        hasMore: cachedHasMore,
        setRetryCount,
        hasSearched: cachedHasSearched,
        isInitialLoading,
    };
}
