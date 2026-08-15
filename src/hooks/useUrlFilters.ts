import { SLIDER_CONFIG } from "@/config/filters";
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

    const resetFilters = useCallback(() => {
        updateParams({
            with_genres: null,
            without_genres: null,
            "release_date.gte": null,
            "release_date.lte": null,
            "vote_average.gte": null,
            "vote_average.lte": null,
        });
    }, [updateParams]);

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

    const onChangeSliderValue = useCallback(
        (type: "release_date" | "vote_average", value: number[]) => {
            const [min, max] = value;
            const config = SLIDER_CONFIG[type];

            const isMinDefault = min === undefined || min <= config.min;
            const isMaxDefault = max === undefined || max >= config.max;
            if (type === "release_date") {
                updateParams({
                    "release_date.gte": isMinDefault ? null : `${min}-01-01`,
                    "release_date.lte": isMaxDefault ? null : `${max}-12-31`,
                });
            } else if (type === "vote_average") {
                updateParams({
                    "vote_average.gte": isMinDefault ? null : min.toString(),
                    "vote_average.lte": isMaxDefault ? null : max.toString(),
                });
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [updateParams],
    );

    return {
        query: searchParams.get("with_text_query") || "",
        type: searchParams.get("type") || "movie",
        status: searchParams.get("status") || "all",

        withGenres: searchParams.get("with_genres") || "",
        withoutGenres: searchParams.get("without_genres") || "",

        releaseDateGte: searchParams.get("release_date.gte") || "",
        releaseDateLte: searchParams.get("release_date.lte") || "",
        voteAverageGte: searchParams.get("vote_average.gte") || "",
        voteAverageLte: searchParams.get("vote_average.lte") || "",

        pickedWithGenres,
        pickedWithoutGenres,

        updateParams,
        toggleGenre,
        onChangeSliderValue,

        resetFilters,
    };
}
