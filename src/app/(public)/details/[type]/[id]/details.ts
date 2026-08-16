import axios from "axios";
import { cache } from "react";
import { getMediaDetails, getMediaRecommendations } from "@/services/tmdb/movieService";
import type { MovieDetails, TVDetails } from "@/types";
import { handleError } from "@/helpers/errorHandler";

export const getCachedMediaDetails = cache(
    async (id: string, type: "movie" | "tv"): Promise<MovieDetails | TVDetails | null> => {
        try {
            return await getMediaDetails(id, type);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },
);

export const getCachedMediaRecommendations = cache(
    async (id: string, type: "movie" | "tv") => {
        try {
            return await getMediaRecommendations(type, id);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            handleError(error, `Не удалось получить рекомендации для ${type} с ID ${id}`);
            return null;
        }
    },
);