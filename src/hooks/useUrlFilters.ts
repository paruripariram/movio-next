import { GenreStatus } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

function parseNumericIds(rawParam: string | null): number[] {
    if (!rawParam) return [];

    return rawParam
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isInteger(id) && id > 0);
}

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

            const queryString = nextParams.toString();
            const targetUrl = queryString
                ? `${pathname}?${queryString}`
                : pathname;

            router.replace(targetUrl, {
                scroll: false,
            });
        },
        [searchParams, pathname, router],
    );

    const { pickedWithGenres, pickedWithoutGenres } = useMemo(() => {
        const withGenres = searchParams.get("with_genres") || "";
        const withoutGenres = searchParams.get("without_genres") || "";

        return {
            pickedWithGenres: parseNumericIds(withGenres),
            pickedWithoutGenres: parseNumericIds(withoutGenres),
        };
    }, [searchParams]);

    const toggleGenre = useCallback(
        (genreId: number, status: GenreStatus) => {
            const cleanWith = pickedWithGenres.filter((id) => id !== genreId);
            const cleanWithout = pickedWithoutGenres.filter(
                (id) => id !== genreId,
            );
            const newWith =
                status === "include" ? [...cleanWith, genreId] : cleanWith;
            const newWithout =
                status === "exclude"
                    ? [...cleanWithout, genreId]
                    : cleanWithout;

            updateParams({
                with_genres: newWith.length > 0 ? newWith.join(",") : null,
                without_genres:
                    newWithout.length > 0 ? newWithout.join(",") : null,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [pickedWithGenres, pickedWithoutGenres, updateParams],
    );

    return {
        query: searchParams.get("with_text_query") || "",
        type: searchParams.get("type") || "movie",
        status: searchParams.get("status") || "all",

        withGenres: searchParams.get("with_genres") || "",
        withoutGenres: searchParams.get("without_genres") || "",

        pickedWithGenres,
        pickedWithoutGenres,

        updateParams,
        toggleGenre,
        searchParams,
    };
}
