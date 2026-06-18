export type collectionItem = {
    id: number;
    title: string;
    genres: string[];
    poster_path: string;
    vote_average: number;
    type: "movie" | "tv";
    status: "wishlist" | "watched";
};
