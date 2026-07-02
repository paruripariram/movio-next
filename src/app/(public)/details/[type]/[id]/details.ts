import axios from "axios";
import { cache } from "react";
import { getMediaDetails } from "@/services/tmdb/movieService";
import type { MovieDetails, TVDetails } from "@/types";

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