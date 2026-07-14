export type collectionItem = {
    id: number;
    title: string;
    genre_ids: number[];
    poster_path: string | null;
    vote_average: number;
    type: "movie" | "tv";
    status: "wishlist" | "watched";
    platform?: string;
};
