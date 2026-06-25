"use client";

import Card from "@/components/Card";
import useNowPlaying from "@/hooks/useNowPlaying";
import useRecommendation from "@/hooks/useRecommendation";
import { useGenresContext } from "@/context/GenresContext";
import { useRef, useState } from "react";
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

    const [canScrollLeftNow, setCanScrollLeftNow] = useState(false);
    const [canScrollRightNow, setCanScrollRightNow] = useState(true);

    const [canScrollLeftRec, setCanScrollLeftRec] = useState(false);
    const [canScrollRightRec, setCanScrollRightRec] = useState(true);

    function scrollByRef(
        ref: React.RefObject<HTMLDivElement | null>,
        dir: "left" | "right",
    ) {
        if (!ref.current) return;
        const step = Math.round(ref.current.clientWidth * 0.7);
        ref.current.scrollBy({
            left: dir === "left" ? -step : step,
            behavior: "smooth",
        });
    }

    function handleScroll(ref: React.RefObject<HTMLDivElement | null>, setCanScrollLeft: (val: boolean) => void, setCanScrollRight: (val: boolean) => void) {
        if (!ref.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }

    return (
        <div className="flex flex-col gap-10 py-6 text-white">
            <div className="flex flex-col gap-4">
                {nowPlaying.length > 0 && !isLoadingNowPlaying && (
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-gray-400 text-2xl font-semibold">
                            Сейчас в прокате
                        </h2>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollByRef(nowRef, "left")}
                                disabled={!canScrollLeftNow}
                                className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <CircleArrowLeft className="text-primary w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scrollByRef(nowRef, "right")}
                                disabled={!canScrollRightNow}
                                className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <CircleArrowRight className="text-primary w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {isLoadingNowPlaying && (
                    <div className="flex justify-center py-10 w-full">
                        <Loader size="small">
                            Загрузка фильмов в прокате...
                        </Loader>
                    </div>
                )}

                {nowPlaying.length === 0 && !isLoadingNowPlaying && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 max-w-2xl mx-auto w-full text-center my-4">
                        <p className="text-zinc-400 text-lg font-medium">
                            Нет фильмов в прокате или не удалось их загрузить
                        </p>
                    </div>
                )}

                {nowPlaying.length > 0 && !isLoadingNowPlaying && (
                    <div className="relative group -mx-4 px-4">
                        <div
                            ref={nowRef}
                            onScroll={() => handleScroll(nowRef, setCanScrollLeftNow, setCanScrollRightNow)}
                            className="flex gap-6 overflow-x-auto w-full py-2 snap-x snap-mandatory scrollbar-hide"
                        >
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
                                        className="snap-start flex-none w-56 sm:w-64 md:w-72 h-105 outline-none focus:scale-[1.01] transition-transform"
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
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {recommendations.length > 0 && !isLoadingRecommendations && (
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-gray-400 text-2xl font-semibold">
                            Рекомендации для вас
                        </h2>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollByRef(recRef, "left")}
                                className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={!canScrollLeftRec}
                            >
                                <CircleArrowLeft className="text-primary w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scrollByRef(recRef, "right")}
                                className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={!canScrollRightRec}
                            >
                                <CircleArrowRight className="text-primary w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {isLoadingRecommendations && (
                    <div className="flex justify-center py-10 w-full">
                        <Loader size="small">Загрузка рекомендаций...</Loader>
                    </div>
                )}

                {recommendations.length === 0 && !isLoadingRecommendations && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 max-w-2xl mx-auto w-full text-center my-4">
                        <p className="text-zinc-400 text-lg font-medium">
                            Нет персональных рекомендаций или произошла ошибка
                        </p>
                    </div>
                )}

                {recommendations.length > 0 && !isLoadingRecommendations && (
                    <div className="relative group -mx-4 px-4">
                        <div
                            ref={recRef}
                            onScroll={() => handleScroll(recRef, setCanScrollLeftRec, setCanScrollRightRec)}
                            className="flex gap-6 overflow-x-auto w-full py-2 snap-x snap-mandatory scrollbar-hide"
                        >
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
                                        className="snap-start flex-none w-56 sm:w-64 md:w-72 h-105 outline-none focus:scale-[1.01] transition-transform"
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
