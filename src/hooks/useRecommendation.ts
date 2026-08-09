"use client";

import { useEffect, useState } from "react";
import type { collectionItem, SearchResult } from "../types";
import { search } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";
import { useGenresStore } from "@/store/genreStore";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";

type MovieResult = Omit<
    Extract<SearchResult, { media_type: "movie" }>,
    "media_type"
>;
type TvResult = Omit<Extract<SearchResult, { media_type: "tv" }>, "media_type">;

function addMovieMediaType(items: MovieResult[]): SearchResult[] {
    return items.map((item) => ({ ...item, media_type: "movie" }));
}

function addTvMediaType(items: TvResult[]): SearchResult[] {
    return items.map((item) => ({ ...item, media_type: "tv" }));
}

export default function useRecommendation() {
    const { isLoadingUser } = useAuthStore();

    const collectionArr = useCollectionStore((state) => state.collectionArr);
    const excludedIds = new Set(
        collectionArr
            .filter((item) => item.status === "watched")
            .map((item) => item.id),
    );

    const isLoadingCollection = useCollectionStore(
        (state) => state.isLoadingCollection,
    );
    const criticalError = useCollectionStore((state) => state.criticalError);

    const [recommendations, setRecommendations] = useState<
        SearchResult[] | null
    >(null);

    const genresMap = useGenresStore((state) => state.genresMap);
    const movieGenresCount = Object.keys(genresMap.movieGenres).length;
    const tvGenresCount = Object.keys(genresMap.tvGenres).length;
    const isLoadingGenres = useGenresStore((state) => state.isLoading);

    const isLoadingRecommendations =
        !criticalError &&
        (isLoadingUser ||
            isLoadingCollection ||
            isLoadingGenres ||
            recommendations === null);

    const isAbortError = (error: unknown) =>
        (error instanceof DOMException && error.name === "AbortError") ||
        (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "ERR_CANCELED");

    useEffect(() => {
        if (
            isLoadingCollection ||
            isLoadingUser ||
            isLoadingGenres ||
            criticalError
        ) {
            return;
        }

        const fetchRecommendations = async (signal: AbortSignal) => {
            try {
                if (collectionArr.length === 0 || criticalError) {
                    const data = await search({ query: "", signal });
                    if (signal.aborted) return;
                    setRecommendations(data.results);
                    return;
                }

                const getTopGenreIds = (items: collectionItem[]) => {
                    const counts: Record<string, number> = {};

                    items.forEach((item) => {
                        item.genre_ids.forEach((genreId) => {
                            counts[genreId] = (counts[genreId] || 0) + 1;
                        });
                    });

                    return Object.entries(counts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([id]) => id)
                        .join(",");
                };
                const movies = collectionArr.filter(
                    (item) => item.type === "movie",
                );
                const tvShows = collectionArr.filter(
                    (item) => item.type === "tv",
                );

                const topMovieGenres = getTopGenreIds(movies);
                const topTvGenres = getTopGenreIds(tvShows);

                const results = await Promise.all([
                    search({
                        query: "",
                        type: "movie",
                        genres: topMovieGenres,
                        signal,
                    }),
                    search({
                        query: "",
                        type: "tv",
                        genres: topTvGenres,
                        signal,
                    }),
                ]);

                const combinedResults = [
                    ...addMovieMediaType(results[0].results as MovieResult[]),
                    ...addTvMediaType(results[1].results as TvResult[]),
                ]
                    .filter((item) => !excludedIds.has(item.id))
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 20);
                if (signal.aborted) return;
                setRecommendations(combinedResults);
            } catch (error) {
                if (isAbortError(error) || signal.aborted) return;
                handleError(error, "Error fetching recommendations:");
                setRecommendations([]);
            }
        };
        const abortController = new AbortController();
        const signal = abortController.signal;
        fetchRecommendations(signal);
        return () => {
            abortController.abort();
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        collectionArr,
        movieGenresCount,
        tvGenresCount,
        isLoadingCollection,
        isLoadingUser,
        criticalError,
    ]);
    return { recommendations, isLoadingRecommendations };
}
