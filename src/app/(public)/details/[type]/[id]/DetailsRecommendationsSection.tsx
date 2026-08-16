import HorizontalCarouselSection from "@/components/media/HorizontalCarouselSection";
import { getCachedMediaRecommendations } from "./details";

interface DetailsRecommendationsSectionProps {
    id: string;
    type: "movie" | "tv";
}

export async function DetailsRecommendationsSection({ id, type }: DetailsRecommendationsSectionProps) {
    const res = await getCachedMediaRecommendations(id, type);
    const recommendations = res?.results || [];

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <HorizontalCarouselSection
            title="Также может понравиться"
            data={recommendations}
            isLoading={false}
        />
    );
}