'use client'

import { useEffect, useState } from "react";
import type { MovieDetails, TVDetails } from "../types";
import { getMediaDetails } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";

export default function useMediaDetails(id: string, type: "movie" | "tv") {
    const [details, setDetails] = useState<MovieDetails | TVDetails | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [prevId, setPrevId] = useState(id);
    if (id !== prevId) {
        setPrevId(id);
        setDetails(null);
        setError(null);
    }

    useEffect(() => {
        async function fetchMediaDetails(
            id: string,
            type: "movie" | "tv",
            signal: AbortSignal,
        ) {
            setLoading(true);
            setError(null);
            try {
                const data = await getMediaDetails(id, type, signal);
                setDetails(data);
            } catch (error) {
                handleError(error, "Error fetching media details:", setError);
            } finally {
                setLoading(false);
            }
        }
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetchMediaDetails(id, type, signal);
        return () => {
            abortController.abort();
        };
    }, [id, type]);

    return { details, loading, error };
}
