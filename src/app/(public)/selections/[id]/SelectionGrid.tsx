"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/media/Card";
import { detailsRouter } from "@/helpers/detailsRouter";
import { SearchResult } from "@/types/tmdb";

interface SelectionGridProps {
    items: SearchResult[];
    defaultType: "movie" | "tv";
}

export default function SelectionGrid({ items, defaultType }: SelectionGridProps) {
    const router = useRouter();

    return (
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-6 p-2 sm:p-6 justify-items-center">
            {items.map((item) => (
                <div key={item.id} className="w-full min-w-0 flex justify-center">
                    <Card
                        item={item}
                        onClick={() => {
                            detailsRouter(
                                router,
                                item.id,
                                (item.media_type as "movie" | "tv") || defaultType
                            );
                        }}
                    />
                </div>
            ))}
        </div>
    );
}