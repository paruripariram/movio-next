"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "../types";
import { search } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";

export default function useMovieSearch(
    searchQuery: string,
    type: "movie" | "tv",
    genres: string,
) {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const prevParams = useRef({ searchQuery, type, genres });

    useEffect(() => {
        const isFiltersChanged =
            prevParams.current.type !== type ||
            prevParams.current.genres !== genres ||
            prevParams.current.searchQuery !== searchQuery;

        if (isFiltersChanged) {
            setPage(1);
            prevParams.current = { searchQuery, genres, type };

            if(page !== 1) return
        }

        async function fetchResults(signal: AbortSignal) {
            setIsDebouncing(false);
            setError(null);
            setIsLoading(true);
            try {
                const query = searchQuery.trim();
                const data = await search({
                    query,
                    page,
                    type,
                    genres,
                    signal,
                });
                if (page === 1) {
                    setSearchResults(data.results);
                } else {
                    setSearchResults((prev) => [...prev, ...data.results]);
                }
                setHasMore(page < data.total_pages);
                setError(null);
            } catch (error) {
                handleError(error, "Error fetching search results:", {
                    setErrorCallback: setError,
                });
            } finally {
                setIsLoading(false);
            }
        }

        let debounceTimeout: ReturnType<typeof setTimeout>;

        const abortController = new AbortController();
        const signal = abortController.signal;
        if (page === 1) {
            debounceTimeout = setTimeout(() => {
                setIsDebouncing(true);
                fetchResults(signal);
            }, 500);
        } else {
            fetchResults(signal);
        }
        return () => {
            clearTimeout(debounceTimeout);
            abortController.abort();
        };
    }, [searchQuery, page, retryCount, type, genres]);

    return {
        searchResults,
        isLoading,
        error,
        setError,
        isDebouncing,
        page,
        setPage,
        hasMore,
        setRetryCount,
    };
}
