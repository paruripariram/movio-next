import { handleError } from "@/helpers/errorHandler";
import { tmdbApi } from "./axios";
import type { Genre, MovieDetails, SearchResult, TVDetails } from "@/types/tmdb";

export const search = async ({
    query,
    type = "movie",
    withGenres = "",
    withoutGenres = "",
    releaseDateGte = "",
    releaseDateLte = "",
    voteAverageGte = "",
    voteAverageLte = "",
    sortBy = "popularity.desc",
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
    sortBy?: string;
    page?: number;
    signal?: AbortSignal;
}) => {
    const dateGteKey =
        type === "tv" ? "first_air_date.gte" : "release_date.gte";
    const dateLteKey =
        type === "tv" ? "first_air_date.lte" : "release_date.lte";
    if (sortBy === "release_date.desc" && type === "tv") {
        sortBy = "first_air_date.desc";
    } else if (sortBy === "release_date.asc" && type === "tv") {
        sortBy = "first_air_date.asc";
    }
    const response = await tmdbApi.get(`/discover/${type}`, {
        params: {
            with_text_query: query,
            with_genres: withGenres,
            without_genres: withoutGenres,
            [dateGteKey]: releaseDateGte,
            [dateLteKey]: releaseDateLte,
            "vote_average.gte": voteAverageGte,
            "vote_average.lte": voteAverageLte,
            sort_by: sortBy,
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

export const getMediaRecommendations = async (
    type: "movie" | "tv",
    id: string,
) => {
    const response = await tmdbApi.get(`/${type}/${id}/recommendations`, {
        params: { page: 1 },
    });
    return {
        ...response.data,
        results: (response.data.results as SearchResult[]).map((item) => ({
            ...item,
            media_type: type,
        })),
    };
};

export const getPersonFullData = async (personId: string) => {
    const response = await tmdbApi.get(`/person/${personId}`, {
        params: { append_to_response: "combined_credits" },
    });
    return response.data;
};

export const getSelectionData = async (movieIds: string[]) => {
  try {
    const promises = movieIds.map((id) =>
      getMediaDetails(id, "movie").catch((err) => {
        console.warn(`[TMDB] Не удалось загрузить фильм ID ${id}:`, err);
        return null;
      })
    );
    
    const results = await Promise.all(promises);

    return results.filter(Boolean).map((movie: MovieDetails | TVDetails) => ({
      id: movie.id,
      title: "title" in movie ? movie.title : movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: "release_date" in movie ? movie.release_date : movie.first_air_date || '',
      media_type: "title" in movie ? "movie" : "tv",
      genres: movie.genres ? movie.genres.slice(0, 2) : [],
    })) as unknown as SearchResult[];
  } catch (error) {
    handleError(error, 'Ошибка при загрузке подборки:');
    return [];
  }
};