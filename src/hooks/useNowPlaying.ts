'use client'

import { useEffect, useState } from "react";
import type { SearchResult } from "../types";
import { getNowPlaying } from "@/services/tmdb/movieService";

export default function useNowPlaying() {
    const [nowPlaying, setNowPlaying] = useState<SearchResult[]>([]);
    const [isLoadingNowPlaying, setIsLoadingNowPlaying] = useState(false);
    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                setIsLoadingNowPlaying(true);
                const data = await getNowPlaying();
                setNowPlaying(data.results);
                setIsLoadingNowPlaying(false);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(
                        "Error fetching now playing movies:",
                        error.message,
                    );
                    setIsLoadingNowPlaying(false);
                }
            } finally {
                setIsLoadingNowPlaying(false);
            }
        };
        fetchNowPlaying();
    }, []);

    return { nowPlaying, isLoadingNowPlaying };
}
