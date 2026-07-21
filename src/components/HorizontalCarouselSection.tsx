"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { detailsRouter } from "@/helpers/detailsRouter";
import Card from "./Card";
import { collectionItem, SearchResult } from "@/types";

interface HorizontalCarouselSectionProps {
    data: SearchResult[] | collectionItem[];
    title: string;
}

export default function HorizontalCarouselSection({ data, title }: HorizontalCarouselSectionProps) {
    const router = useRouter();

    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        align: "start",
    });

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const onSelect = useCallback((api: typeof emblaApi) => {
        if (!api) return;
        setCanScrollLeft(api.canScrollPrev());
        setCanScrollRight(api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        const timer = setTimeout(() => {
            onSelect(emblaApi);
        }, 0);

        emblaApi.on("reInit", onSelect).on("select", onSelect);

        return () => {
            clearTimeout(timer);
            emblaApi.off("reInit", onSelect).off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative group -mx-2 sm:-mx-4 px-2 sm:px-4">
            <div className="flex items-center justify-between px-1 sm:px-2 mb-2 sm:mb-4">
                <h2 className="text-gray-400 text-lg sm:text-xl lg:text-2xl font-semibold">
                    {title}
                </h2>
                <div className="flex gap-1.5 sm:gap-2">
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollLeft}
                        className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-1.5 sm:p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <CircleArrowLeft className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollRight}
                        className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-1.5 sm:p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <CircleArrowRight className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="overflow-visible" ref={emblaRef}>
                    <div className="flex gap-3 sm:gap-4 lg:gap-6 py-4 sm:py-6 2xl:py-8">
                        {(data || []).map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="flex-[0_0_auto] w-36 sm:w-48 lg:w-56 2xl:w-64"
                                >
                                    <Card
                                        item={item}
                                        onClick={() =>
                                            detailsRouter(
                                                router,
                                                item.id,
                                                "media_type" in item ? item.media_type : item.type,
                                            )
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}