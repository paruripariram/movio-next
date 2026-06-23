"use client";

import Card from "@/components/Card";
import useNowPlaying from "@/hooks/useNowPlaying";
import useRecommendation from "@/hooks/useRecommendation";
import { useGenresContext } from "@/context/GenresContext";
import { useRef } from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import detailsRouter from "@/helpers/detailsRouter";
import Loader from "@/components/Loader";

function Home() {
    const { nowPlaying, isLoadingNowPlaying } = useNowPlaying();
    const { recommendations, isLoadingRecommendations } = useRecommendation();
    const { genresMap } = useGenresContext();
    const router = useRouter();

    const nowRef = useRef<HTMLDivElement | null>(null);
    const recRef = useRef<HTMLDivElement | null>(null);

    function scrollByRef(
        ref: React.RefObject<HTMLDivElement | null>,
        dir: "left" | "right",
    ) {
        if (!ref.current) {
            return;
        }
        const step = Math.round(ref.current.clientWidth * 0.7);
        ref.current.scrollBy({
            left: dir === "left" ? -step : step,
            behavior: "smooth",
        });
    }
    return (
        <div className="flex flex-col gap-5">
            <div className="-mx-4">
                <div className="relative px-4">
                    <button
                        onClick={() => scrollByRef(nowRef, "left")}
                        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full cursor-pointer"
                    >
                        <CircleArrowLeft className="text-primary" />
                    </button>
                    {nowPlaying.length === 0 && !isLoadingNowPlaying && (
                        <p>Нет фильмов в прокате</p>
                    )}
                    {isLoadingNowPlaying && (
                        <Loader size="small">
                            Загрузка фильмов в прокате...
                        </Loader>
                    )}
                    {nowPlaying.length > 0 && !isLoadingNowPlaying && (
                        <p className="text-gray-500 text-3xl px-6">
                            Сейчас в прокате
                        </p>
                    )}
                    <div
                        ref={nowRef}
                        className="flex gap-6 overflow-x-auto w-full py-4 snap-x snap-mandatory scrollbar-hide"
                    >
                        {nowPlaying.length > 0 && !isLoadingNowPlaying && (
                            <>
                                {nowPlaying.map((item) => {
                                    const itemGenres = item.genre_ids
                                        .map(
                                            (id) =>
                                                genresMap.movieGenres[id] ||
                                                genresMap.tvGenres[id],
                                        )
                                        .filter((name): name is string =>
                                            Boolean(name),
                                        );
                                    return (
                                        <div
                                            key={item.id}
                                            tabIndex={0}
                                            className="snap-start flex-none w-56 sm:w-64 md:w-72 h-105"
                                        >
                                            <Card
                                                item={item}
                                                genres={itemGenres}
                                                onClick={() =>
                                                    detailsRouter(
                                                        router,
                                                        item.id,
                                                        "movie",
                                                    )
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => scrollByRef(nowRef, "right")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full cursor-pointer"
                    >
                        <CircleArrowRight className="text-primary" />
                    </button>
                </div>
            </div>
            <div className="-mx-4">
                <div className="relative px-4">
                    <button
                        onClick={() => scrollByRef(recRef, "left")}
                        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full cursor-pointer"
                    >
                        <CircleArrowLeft className="text-primary" />
                    </button>
                    {recommendations.length === 0 &&
                        !isLoadingRecommendations && <p>Нет рекомендаций</p>}
                    {isLoadingRecommendations && (
                        <Loader size="small">Загрузка рекомендаций...</Loader>
                    )}
                    {recommendations.length > 0 &&
                        !isLoadingRecommendations && (
                            <p className="text-gray-500 text-3xl px-6">
                                Рекомендации
                            </p>
                        )}
                    <div
                        ref={recRef}
                        className="flex gap-6 overflow-x-auto w-full py-4 snap-x snap-mandatory scrollbar-hide"
                    >
                        {recommendations.length > 0 &&
                            !isLoadingRecommendations && (
                                <>
                                    {recommendations.map((item) => {
                                        const itemGenres = item.genre_ids
                                            .map(
                                                (id) =>
                                                    genresMap.movieGenres[id] ||
                                                    genresMap.tvGenres[id],
                                            )
                                            .filter((name): name is string =>
                                                Boolean(name),
                                            );
                                        return (
                                            <div
                                                key={item.id}
                                                tabIndex={0}
                                                className="snap-start flex-none w-56 sm:w-64 md:w-72 h-105"
                                            >
                                                <Card
                                                    item={item}
                                                    genres={itemGenres}
                                                    onClick={() =>
                                                        detailsRouter(
                                                            router,
                                                            item.id,
                                                            item.media_type,
                                                        )
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                    </div>
                    <button
                        onClick={() => scrollByRef(recRef, "right")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full cursor-pointer"
                    >
                        <CircleArrowRight className="text-primary" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
