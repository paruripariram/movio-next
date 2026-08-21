import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton";
import { FEATURED_SELECTIONS } from "@/config/selectionsConfig";
import { search } from "@/services/tmdb/movieService";
import SelectionGrid from "./SelectionGrid";
import { SearchResult } from "@/types";

interface PageProps {
    params: Promise<{ id: string }>;
}

function getSelection(idOrSlug: string) {
    return FEATURED_SELECTIONS.find(
        (s) => s.id === idOrSlug || s.slug === idOrSlug
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const selection = getSelection(id);
    if (!selection) return { title: "Подборка не найдена" };
    return { title: `${selection.title} — Подборка`, description: selection.description };
}

export default async function SelectionDetailPage({ params }: PageProps) {
    const { id } = await params;
    const selection = getSelection(id);

    if (!selection) notFound();

    const moviesData = await search(selection.params);
    const movies: SearchResult[] = moviesData?.results || [];
    const defaultType = (selection.params.type as "movie" | "tv") || "movie";

    const backdropPath = selection.backdropUrl || "/noPoster.webp";

    return (
        <div className="flex flex-col min-h-screen w-full min-w-0">
            <div className="relative -mt-4 -mx-4 sm:-mt-6 sm:-mx-6 md:-mt-8 md:-mx-8 lg:-mt-10 lg:-mx-10 xl:-mt-12 xl:-mx-12 2xl:-mt-16 2xl:-mx-16 overflow-hidden h-90 sm:h-105 lg:h-120 shrink-0 bg-back-link-color">
                <div className="absolute z-30 top-4 left-4 sm:top-6 sm:left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-16 cursor-pointer">
                    <BackButton />
                </div>

                <Image
                    src={backdropPath}
                    alt={selection.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top opacity-60"
                />

                <div className="absolute inset-0 z-10 bg-linear-to-t from-bgcolor via-bgcolor/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pb-4 sm:pb-6 lg:pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                    <div className="flex flex-col gap-1.5 max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                            {selection.title}
                        </h1>
                        {selection.subtitle && (
                            <span className="text-gray-300 font-normal text-xl sm:text-2xl lg:text-3xl mt-1 block">
                                {selection.subtitle}
                            </span>
                        )}
                        {selection.description && (
                            <p className="text-gray-300 italic text-sm sm:text-base line-clamp-2 mt-2">
                                «{selection.description.replace(/^«|»$/g, "")}»
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 pt-6 pb-12 w-full min-w-0">
                {movies.length > 0 ? (
                    <SelectionGrid items={movies} defaultType={defaultType} />
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Фильмы не найдены
                    </div>
                )}
            </div>
        </div>
    );
}