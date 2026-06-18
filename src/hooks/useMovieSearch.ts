"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "../types";
import { search } from "@/services/tmdb/movieService";
import axios from "axios";

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

    const currentParams = useRef({ searchQuery, type, genres });

    const [prevQuery, setPrevQuery] = useState(searchQuery);
    const [prevType, setPrevType] = useState(type);
    const [prevGenres, setPrevGenres] = useState(genres);

    if (
        searchQuery !== prevQuery ||
        type !== prevType ||
        genres !== prevGenres
    ) {
        setPrevQuery(searchQuery);
        setPrevType(type);
        setPrevGenres(genres);
        setPage(1);
    }

    useEffect(() => {
        const isFiltersChanged =
            currentParams.current.type !== type ||
            currentParams.current.genres !== genres ||
            currentParams.current.searchQuery !== searchQuery;

        currentParams.current = { searchQuery, type, genres };
        if (isFiltersChanged && page !== 1) return;

        async function fetchResults(signal: AbortSignal) {
            setIsDebouncing(false);
            setError(null);
            setIsLoading(true);
            try {
                const query = searchQuery.trim();
                // if (query || genres) {
                const data = await search({
                    query,
                    page,
                    type,
                    genres,
                    signal,
                });
                console.log("Search results:", data);
                if (page === 1) {
                    setSearchResults(data.results);
                } else {
                    setSearchResults((prev) => [...prev, ...data.results]);
                }
                setHasMore(page < data.total_pages);
                setError(null);

                // }else {
                //     setSearchResults([]);
                // }
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled");
                    return;
                }
                console.error("Error fetching search results:", error);
                setError(
                    "Failed to load search results. Please try again later.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        let debounceTimeout: ReturnType<typeof setTimeout>;
        // if (searchQuery.trim() === "" && !genres) {
        //     setSearchResults([]);
        //     setHasMore(false);
        //     setIsLoading(false);
        //     setError(null);
        //     setIsDebouncing(false);
        //     return;
        // }

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
