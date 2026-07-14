"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { detailsRouter } from "@/helpers/detailsRouter";
import Card from "./Card";
import { SearchResult } from "@/types";

interface HorizontalCarouselSectionProps {
    data: SearchResult[];
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
        <div className="relative group -mx-4 px-4">
            <div className="flex items-center justify-between px-2 mb-4">
                <h2 className="text-gray-400 text-2xl font-semibold">
                    {title}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollLeft}
                        className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <CircleArrowLeft className="text-primary w-5 h-5" />
                    </button>
                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollRight}
                        className="bg-zinc-800/60 hover:bg-zinc-700/80 text-white p-2 rounded-full cursor-pointer transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <CircleArrowRight className="text-primary w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="-mx-8 px-8 overflow-hidden">
                <div className="overflow-visible" ref={emblaRef}>
                    <div className="flex gap-6 py-8">
                        {data.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="flex-[0_0_auto] w-56 sm:w-64 md:w-72"
                                >
                                    <Card
                                        item={item}
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
            </div>
        </div>
    );
}
