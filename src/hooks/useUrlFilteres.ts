import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

export function useUrlFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const nextParams = new URLSearchParams(searchParams.toString());
            
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "") {
                    nextParams.delete(key);
                } else {
                    nextParams.set(key, value);
                }
            });

            router.replace(`${pathname}?${nextParams.toString()}`, {
                scroll: false,
            });
        },
        [searchParams, pathname, router]
    );

    const pickedGenres = useMemo(() => {
        const withGenres = searchParams.get("with_genres") || "";
        return withGenres
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id !== "")
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0);
    }, [searchParams]);

    const toggleGenre = useCallback(
        (genreId: number, checked: boolean) => {
            const newGenres = checked
                ? [...pickedGenres, genreId]
                : pickedGenres.filter((id) => id !== genreId);
            
            updateParams({ with_genres: newGenres.length > 0 ? newGenres.join(",") : null });
        },
        [pickedGenres, updateParams]
    );

    return {
        query: searchParams.get("with_text_query") || "",
        type: searchParams.get("type") || "movie",
        status: searchParams.get("status") || "all",
        pickedGenres,

        updateParams,
        toggleGenre,
        searchParams,
    };
}