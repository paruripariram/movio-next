"use client";

import useRecommendation from "@/hooks/useRecommendation";
import { useRef, useState } from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import Loader from "@/components/Loader";
import { SearchResult } from "@/types/tmdb";
import HorizontalCarouselSection from "@/components/HorizontalCarouselSection";

interface HomeProps {
    initialNowPlaying: SearchResult[];
}

export default function Home({ initialNowPlaying }: HomeProps) {
    const nowPlaying = initialNowPlaying;

    const { recommendations, isLoadingRecommendations } = useRecommendation();

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

    return (
        <div className="flex flex-col gap-10 py-6 text-white">
            <div className="flex flex-col gap-4">
                {nowPlaying.length > 0 && (
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

                {nowPlaying.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 max-w-2xl mx-auto w-full text-center my-4">
                        <p className="text-zinc-400 text-lg font-medium">
                            Нет фильмов в прокате или не удалось их загрузить
                        </p>
                    </div>
                )}

                {nowPlaying.length > 0 && (
                    <HorizontalCarouselSection CarouselRef={nowRef} data={nowPlaying} setCanScrollLeft={setCanScrollLeftNow} setCanScrollRight={setCanScrollRightNow} mediaType="movie"/>
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
                    <div className="flex flex-col items-center justify-center h-125 w-full text-zinc-400">
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
                    <HorizontalCarouselSection CarouselRef={recRef} data={recommendations} setCanScrollLeft={setCanScrollLeftRec} setCanScrollRight={setCanScrollRightRec}/>
                )}
            </div>
        </div>
    );
}