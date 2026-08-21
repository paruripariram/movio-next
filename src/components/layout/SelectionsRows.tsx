import { search } from "@/services/tmdb/movieService";
import { unstable_cache } from "next/cache";
import { FEATURED_SELECTIONS } from "@/config/selectionsConfig";
import HorizontalCarouselSection from "../media/HorizontalCarouselSection";
import Link from "next/link";

const getCachedSelections = unstable_cache(
    async () => {
        const featuredOnly = FEATURED_SELECTIONS.filter((s) => s.isFeatured);
        const selectionsWithData = await Promise.all(
            featuredOnly.map(async (selection) => {
                const data = await search(selection.params);
                return {
                    ...selection,
                    movies: data.results,
                };
            }),
        );
        return selectionsWithData;
    },
    ["selections-featured"],
    { revalidate: 14400 },
);

export default async function SelectionsRows() {
    const selections = await getCachedSelections();
    return (
        <section className="py-12">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-white mb-2">
                    Специально для вас
                </h2>
                <p className="text-gray-400">
                    Уникальные подборки фильмов под любое настроение
                </p>
            </div>

            <div className="space-y-10 mb-12">
                {selections.map((selection) => (
                    <div
                        key={selection.id}
                        className="flex flex-col gap-3 lg:gap-4"
                    >
                        <HorizontalCarouselSection
                            title={selection.title}
                            data={selection.movies}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-center px-4">
                <Link
                    href="/selections"
                    className="bg-primary text-white h-12 px-8 rounded-xl flex items-center justify-center cursor-pointer shadow-glow hover:shadow-glow-bold transition-all duration-300 w-full sm:w-auto font-medium"
                >
                    Смотреть все подборки
                </Link>
            </div>
        </section>
    );
}
