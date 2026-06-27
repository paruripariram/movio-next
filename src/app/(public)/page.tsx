import { unstable_cache } from "next/cache";
import HomeClient from "./HomeClient";
import { getNowPlaying } from "@/services/tmdb/movieService";

const getCachedNowPlaying = unstable_cache(
    async () => {
        const data = await getNowPlaying();
        return data.results || [];
    },
    ["now-playing"],
    { revalidate: 14400 },
);

export default async function HomePage() {
    const initialNowPlaying = await getCachedNowPlaying();

    return <HomeClient initialNowPlaying={initialNowPlaying} />;
}
