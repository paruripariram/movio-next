import { handleError } from "@/helpers/errorHandler";
import { getMovieGenres, getTvGenres } from "@/services/tmdb/movieService";
import { GenresMap } from "@/types";
import { create } from "zustand";

interface GenresState {
    genresMap: GenresMap;
    isLoading: boolean;

    fetchGenres: () => Promise<void>;
}

export const useGenresStore = create<GenresState>((set) => ({
    genresMap: { movieGenres: {}, tvGenres: {} },
    isLoading: false,
    fetchGenres: async () => {
        set({ isLoading: true });
        try {
            const [movieGenres, tvGenres] = await Promise.all([
                getMovieGenres(),
                getTvGenres(),
            ]);
            set({ genresMap: { movieGenres, tvGenres }, isLoading: false });
        } catch (error) {
            handleError(error, "Error fetching genres:");
            set({ isLoading: false });
        }
    },
}));
