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
        <div className="flex flex-col gap-10 py-6 text-white">
            <div className="flex flex-col gap-4">
                {initialNowPlaying.length > 0 ? (
                    <HorizontalCarouselSection
                        title="Сейчас в прокате"
                        data={initialNowPlaying}
                    />
                ) : (
                    <div className="text-center py-12 text-zinc-400">
                        Нет фильмов в прокате
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {isLoadingRecommendations ? (
                    <div className="flex justify-center py-12">
                        <Loader size="small">Загрузка рекомендаций...</Loader>
                    </div>
                ) : recommendations.length > 0 ? (
                    <HorizontalCarouselSection
                        title="Рекомендации для вас"
                        data={recommendations}
                    />
                ) : (
                    <div className="text-center py-12 text-zinc-400">
                        Нет персональных рекомендаций
                    </div>
                )}
            </div>
        </div>
    );
}
