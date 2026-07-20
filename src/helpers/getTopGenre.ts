import { collectionItem } from "@/types";
import { GenresMap } from "@/types";

interface TopGenreResult {
    genreName: string;
    percentage: number;
}

export const getTopGenre = (
    items: collectionItem[],
    genresMap: GenresMap,
): TopGenreResult => {
    if (!items || items.length === 0) {
        return { genreName: "Не определен", percentage: 0 };
    }

    const counts: Record<number, number> = {};

    items.forEach((item) => {
        item.genre_ids?.forEach((genreId) => {
            counts[genreId] = (counts[genreId] || 0) + 1;
        });
    });

    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    if (sortedEntries.length === 0) {
        return { genreName: "Не определен", percentage: 0 };
    }

    const topGenreId = Number(sortedEntries[0][0]);
    const topGenreCount = sortedEntries[0][1];

    const percentage = Math.round((topGenreCount / items.length) * 100);

    const rawGenreName =
        genresMap.movieGenres?.[topGenreId] ||
        genresMap.tvGenres?.[topGenreId] ||
        "Не определен";

    const genreName =
        rawGenreName.charAt(0).toUpperCase() + rawGenreName.slice(1);

    return { genreName, percentage };
};
