"use client";

import useRecommendation from "@/hooks/useRecommendation";
import Loader from "@/components/Loader";
import HorizontalCarouselSection from "@/components/HorizontalCarouselSection";
import { SearchResult } from "@/types/tmdb";

interface HomeProps {
    initialNowPlaying: SearchResult[];
}

export default function Home({ initialNowPlaying }: HomeProps) {
    const { recommendations, isLoadingRecommendations } = useRecommendation();

    return (
        <div className="flex flex-col gap-6 lg:gap-8 2xl:gap-10 py-2 sm:py-4 2xl:py-6 text-white w-full max-w-400 2xl:max-w-none mx-auto">
            <div className="flex flex-col gap-3 lg:gap-4">
                {initialNowPlaying.length > 0 ? (
                    <HorizontalCarouselSection
                        title="Сейчас в прокате"
                        data={initialNowPlaying}
                    />
                ) : (
                    <div className="text-center py-8 sm:py-12 text-zinc-400 text-sm sm:text-base">
                        Нет фильмов в прокате
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 lg:gap-4">
                {isLoadingRecommendations ? (
                    <div className="flex justify-center py-8 sm:py-12">
                        <Loader size="small">Загрузка рекомендаций...</Loader>
                    </div>
                ) : (recommendations || []).length > 0 ? (
                    <HorizontalCarouselSection
                        title="Рекомендации для вас"
                        data={recommendations}
                    />
                ) : (
                    <div className="text-center py-8 sm:py-12 text-zinc-400 text-sm sm:text-base">
                        Нет персональных рекомендаций
                    </div>
                )}
            </div>
        </div>
    );
}