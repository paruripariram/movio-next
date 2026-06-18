import tmdbApi from "./axios";
import type { Genre } from "@/types/tmdb";

export const search = async ({
    query,
    type = "movie",
    genres = "",
    page = 1,
    signal,
}: {
    query: string;
    type?: string;
    genres?: string;
    page?: number;
    signal?: AbortSignal;
}) => {
    const response = await tmdbApi.get(`/discover/${type}`, {
        params: { with_text_query: query, with_genres: genres, page },
        signal,
    });
    return response.data;
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
    signal: AbortSignal,
) => {
    const response = await tmdbApi.get(`/${type}/${id}`, {
        params: { append_to_response: "credits" },
        signal,
    });
    return response.data;
};

export const getNowPlaying = async () => {
    const response = await tmdbApi.get("/movie/now_playing",{
        params: { page: 1 },
    });
    return response.data;
}