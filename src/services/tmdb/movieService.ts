import { tmdbApi } from "./axios";
import type { Genre, SearchResult } from "@/types/tmdb";

export const search = async ({
    query,
    type = "movie",
    withGenres = "",
    withoutGenres = "",
    releaseDateGte = "",
    releaseDateLte = "",
    voteAverageGte = "",
    voteAverageLte = "",
    page = 1,
    signal,
}: {
    query: string;
    type?: "movie" | "tv";
    withGenres?: string;
    withoutGenres?: string;
    releaseDateGte?: string;
    releaseDateLte?: string;
    voteAverageGte?: string;
    voteAverageLte?: string;
    page?: number;
    signal?: AbortSignal;
}) => {
    const dateGteKey = type === "tv" ? "first_air_date.gte" : "release_date.gte";
    const dateLteKey = type === "tv" ? "first_air_date.lte" : "release_date.lte";
    const response = await tmdbApi.get(`/discover/${type}`, {
        params: {
            with_text_query: query,
            with_genres: withGenres,
            without_genres: withoutGenres,
            [dateGteKey]: releaseDateGte,
            [dateLteKey]: releaseDateLte,
            "vote_average.gte": voteAverageGte,
            "vote_average.lte": voteAverageLte,
            page,
        },
        signal,
    });
    return {
        ...response.data,
        results: (response.data.results as SearchResult[]).map((item) => ({
            ...item,
            media_type: type,
        })),
    };
};

export const getMovieGenres = async () => {
    const response = await tmdbApi.get("/genre/movie/list");
    const genresMap = response.data.genres.reduce(
        (acc: Record<number, string>, genre: Genre) => {
            acc[genre.id] = genre.name;
            return acc;
        },
        {},
    );
    return genresMap;
};

export const getTvGenres = async () => {
    const response = await tmdbApi.get("/genre/tv/list");
    const genresMap = response.data.genres.reduce(
        (acc: Record<number, string>, genre: Genre) => {
            acc[genre.id] = genre.name;
            return acc;
        },
        {},
    );
    return genresMap;
};
export const getMediaDetails = async (
    id: string,
    type: "movie" | "tv",
    signal?: AbortSignal,
) => {
    const response = await tmdbApi.get(`/${type}/${id}`, {
        params: { append_to_response: "credits" },
        signal,
    });
    return response.data;
};

export const getNowPlaying = async () => {
    const response = await tmdbApi.get("/movie/now_playing", {
        params: { page: 1 },
    });
    return {
        ...response.data,
        results: (response.data.results as SearchResult[]).map((item) => ({
            ...item,
            media_type: "movie" as const,
        })),
    };
};
