'use client'

import { useEffect, useState } from "react";
import type { SearchResult } from "../types";
import { getNowPlaying } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";

export default function useNowPlaying() {
    const [nowPlaying, setNowPlaying] = useState<SearchResult[]>([]);
    const [isLoadingNowPlaying, setIsLoadingNowPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                setIsLoadingNowPlaying(true);
                const data = await getNowPlaying();
                setNowPlaying(data.results);
            } catch (error) {
                handleError(error, "Error fetching now playing movies:", setError);
            } finally {
                setIsLoadingNowPlaying(false);
            }
        };
        fetchNowPlaying();
    }, []);

    return { nowPlaying, isLoadingNowPlaying, error };
}
