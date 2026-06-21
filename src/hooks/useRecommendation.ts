"use client";

import { useEffect, useState } from "react";
import type { collectionItem, SearchResult } from "../types";
import { useGenresContext } from "../context/GenresContext";
import { search } from "@/services/tmdb/movieService";
import { useCollectionContext } from "@/context/CollectionContext";
import { useAuthContext } from "@/context/AuthContext";
import { handleError } from "@/helpers/errorHandler";

export default function useRecommendation() {
    const [error, setError] = useState<string | null>(null);
    const { isLoading } = useAuthContext();
    const { collectionArr, isLoadingCollection } = useCollectionContext();
    const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] =
        useState(true);
    const { genresMap } = useGenresContext();

    type MovieResult = Omit<
        Extract<SearchResult, { media_type: "movie" }>,
        "media_type"
    >;
    type TvResult = Omit<
        Extract<SearchResult, { media_type: "tv" }>,
        "media_type"
    >;

    useEffect(() => {
        if (
            isLoadingCollection ||
            isLoading ||
            !genresMap.movieGenres ||
            !genresMap.tvGenres
        ) {
            return;
        }

        function addMovieMediaType(items: MovieResult[]): SearchResult[] {
            return items.map((item) => ({ ...item, media_type: "movie" }));
        }

        function addTvMediaType(items: TvResult[]): SearchResult[] {
            return items.map((item) => ({ ...item, media_type: "tv" }));
        }

        const fetchRecommendations = async (signal: AbortSignal) => {
            try {
                setIsLoadingRecommendations(true);

                if (collectionArr.length === 0) {
                    const data = await search({ query: "", signal });
                    setRecommendations(data.results);
                    return;
                }
                const movieGenresNameToId = Object.fromEntries(
                    Object.entries(genresMap.movieGenres).map(([id, name]) => [
                        name,
                        id,
                    ]),
                );
                const tvGenresNameToId = Object.fromEntries(
                    Object.entries(genresMap.tvGenres).map(([id, name]) => [
                        name,
                        id,
                    ]),
                );

                const getTopGenreIds = (
                    items: collectionItem[],
                    nameToIdMap: Record<string, string>,
                ) => {
                    const counts: Record<string, number> = {};
                    items.forEach((item) => {
                        item.genres.forEach((genreName) => {
                            counts[genreName] = (counts[genreName] || 0) + 1;
                        });
                    });
                    return Object.entries(counts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([name]) => nameToIdMap[name])
                        .filter(Boolean)
                        .join(",");
                };
                const movies = collectionArr.filter(
                    (item) => item.type === "movie",
                );
                const tvShows = collectionArr.filter(
                    (item) => item.type === "tv",
                );

                const topMovieGenres = getTopGenreIds(
                    movies,
                    movieGenresNameToId,
                );
                const topTvGenres = getTopGenreIds(tvShows, tvGenresNameToId);

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
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 20);
                setRecommendations(combinedResults);
            } catch (error) {
                handleError(error, "Error fetching recommendations:", setError);
            } finally {
                setIsLoadingRecommendations(false);
            }
        };
        const abortController = new AbortController();
        const signal = abortController.signal;
        fetchRecommendations(signal);
        return () => {
            abortController.abort();
        };
    }, [collectionArr, genresMap, isLoadingCollection, isLoading]);
    return { recommendations, isLoadingRecommendations, error };
}
