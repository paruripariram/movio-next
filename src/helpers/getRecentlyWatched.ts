import { collectionItem } from "@/types";

export const getRecentlyWatched = (items: collectionItem[], limit = 5) => {
    return items
        .filter((item) => item.status === "watched" && item.watchedAt)
        .sort((a, b) => {
            return new Date(b.watchedAt!).getTime() - new Date(a.watchedAt!).getTime();
        })
        .slice(0, limit);
};