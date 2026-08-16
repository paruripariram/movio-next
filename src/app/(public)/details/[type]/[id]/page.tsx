import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import MediaDetails from "./MediaDetails";
import { DetailsRecommendationsSection } from "./DetailsRecommendationsSection";
import { getCachedMediaDetails } from "./details";
import HorizontalCarouselSection from "@/components/media/HorizontalCarouselSection";
import { SearchResult } from "@/types";

interface Props {
    params: Promise<{ type: "movie" | "tv"; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { type, id } = await params;
    const details = await getCachedMediaDetails(id, type);

    if (!details) {
        return { title: "Media Details" };
    }

    const title = "title" in details ? details.title : details.name;

    return {
        title: title || "Media Details",
        description: details.overview || "",
    };
}

export default async function MediaDetailsPage({ params }: Props) {
    const { type, id } = await params;
    const details = await getCachedMediaDetails(id, type);

    if (!details) {
        notFound();
    }

    return (
        <MediaDetails
            details={details}
            type={type}
            recommendationsSlot={
                <Suspense
                    key={`${type}-${id}`}
                    fallback={
                        <HorizontalCarouselSection
                            title="Также может понравиться"
                            data={Array.from({ length: 10 }) as SearchResult[]}
                            isLoading={true}
                        />
                    }
                >
                    <DetailsRecommendationsSection id={id} type={type} />
                </Suspense>
            }
        />
    );
}
