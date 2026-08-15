"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { SearchResult } from "../types";
import { search } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";
import { useSearchCacheStore } from "@/store/searchCacheStore";

export interface MovieSearchFilters {
    searchQuery: string;
    type: "movie" | "tv";
    withGenres: string;
    withoutGenres: string;
    releaseDateGte: string;
    releaseDateLte: string;
    voteAverageGte: string;
    voteAverageLte: string;
    sortBy: string;
}

export default function useMovieSearch(filters: MovieSearchFilters) {
    const {
        searchQuery,
        type,
        withGenres,
        withoutGenres,
        releaseDateGte,
        releaseDateLte,
        voteAverageGte,
        voteAverageLte,
        sortBy,
    } = filters;
    const {
        cachedResults,
        cachedPage,
        cachedHasMore,
        cachedHasSearched,
        setCache,
    } = useSearchCacheStore();

    const pathname = usePathname();
    const initialPathnameRef = useRef(pathname);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isInitialLoading, setIsInitialLoading] = useState(false);

    const prevPageRef = useRef(cachedPage);
    const isSearchChangeRef = useRef(false);
    const isFirstRenderRef = useRef(true);

    useEffect(() => {
        if (pathname !== initialPathnameRef.current) {
            return;
        }

        const currentStore = useSearchCacheStore.getState();
        const isFiltersChanged =
            searchQuery !== currentStore.lastQuery ||
            type !== currentStore.lastType ||
            withGenres !== currentStore.lastWithGenres ||
            withoutGenres !== currentStore.lastWithoutGenres ||
            releaseDateGte !== currentStore.lastReleaseDateGte ||
            releaseDateLte !== currentStore.lastReleaseDateLte ||
            voteAverageGte !== currentStore.lastVoteAverageGte ||
            voteAverageLte !== currentStore.lastVoteAverageLte ||
            sortBy !== currentStore.lastSortBy;

        if (isFiltersChanged) {
            const isIncomingPropsEmpty =
                (searchQuery === "" &&
                    withGenres === "" &&
                    withoutGenres === "" &&
                    releaseDateGte === "" &&
                    releaseDateLte === "" &&
                    voteAverageGte === "" &&
                    voteAverageLte === "") ||
                sortBy === "";
            const hasAnyCachedFilters =
                currentStore.lastQuery !== "" ||
                currentStore.lastWithGenres !== "" ||
                currentStore.lastWithoutGenres !== "" ||
                currentStore.lastReleaseDateGte !== "" ||
                currentStore.lastReleaseDateLte !== "" ||
                currentStore.lastVoteAverageGte !== "" ||
                currentStore.lastVoteAverageLte !== "" ||
                currentStore.lastSortBy !== "";

            if (
                isFirstRenderRef.current &&
                isIncomingPropsEmpty &&
                hasAnyCachedFilters
            ) {
                isFirstRenderRef.current = false;
                return;
            }

            isFirstRenderRef.current = false;
            isSearchChangeRef.current = searchQuery !== currentStore.lastQuery;

            setCache({
                cachedResults: [],
                cachedPage: 1,
                cachedHasMore: false,
                cachedHasSearched: false,
                lastQuery: searchQuery,
                lastType: type,
                lastWithGenres: withGenres,
                lastWithoutGenres: withoutGenres,
                lastReleaseDateGte: releaseDateGte,
                lastReleaseDateLte: releaseDateLte,
                lastVoteAverageGte: voteAverageGte,
                lastVoteAverageLte: voteAverageLte,
                lastSortBy: sortBy,
            });
            setIsInitialLoading(true);
            prevPageRef.current = 1;

            if (cachedPage !== 1) {
                return;
            }
        } else {
            isFirstRenderRef.current = false;
        }

        const isPageChanged = prevPageRef.current !== cachedPage;

        if (
            !isFiltersChanged &&
            currentStore.cachedResults.length > 0 &&
            !isPageChanged &&
            retryCount === 0
        ) {
            const savedScrollY = currentStore.cachedScrollY;
            if (savedScrollY > 0) {
                setTimeout(() => {
                    window.scrollTo({
                        top: savedScrollY,
                        behavior: "instant",
                    });
                }, 50);
            }
            return;
        }

        prevPageRef.current = cachedPage;

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
                    withGenres,
                    withoutGenres,
                    releaseDateGte,
                    releaseDateLte,
                    voteAverageGte,
                    voteAverageLte,
                    sortBy,
                    signal,
                });

                const latestStore = useSearchCacheStore.getState();

                if (
                    searchQuery !== latestStore.lastQuery ||
                    withGenres !== latestStore.lastWithGenres ||
                    withoutGenres !== latestStore.lastWithoutGenres ||
                    releaseDateGte !== latestStore.lastReleaseDateGte ||
                    releaseDateLte !== latestStore.lastReleaseDateLte ||
                    voteAverageGte !== latestStore.lastVoteAverageGte ||
                    voteAverageLte !== latestStore.lastVoteAverageLte ||
                    sortBy !== latestStore.lastSortBy ||
                    type !== latestStore.lastType
                ) {
                    return;
                }

                if (cachedPage === 1) {
                    setCache({ cachedResults: data.results });
                } else {
                    const seenIds = new Set(
                        latestStore.cachedResults.map((item) => item.id),
                    );
                    const uniqueNewResults = data.results.filter(
                        (item: SearchResult) => !seenIds.has(item.id),
                    );
                    setCache({
                        cachedResults: [
                            ...latestStore.cachedResults,
                            ...uniqueNewResults,
                        ],
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

        if (cachedPage === 1 && isSearchChangeRef.current) {
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
        type,
        withGenres,
        withoutGenres,
        releaseDateGte,
        releaseDateLte,
        voteAverageGte,
        voteAverageLte,
        sortBy,
        cachedPage,
        retryCount,
        setCache,
        pathname,
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
        searchResults: cachedResults,
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
