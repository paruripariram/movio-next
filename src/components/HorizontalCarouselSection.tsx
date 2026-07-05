import detailsRouter from "@/helpers/detailsRouter";
import Card from "./Card";
import { SearchResult } from "@/types";
import { useRouter } from "next/navigation";
import { useGenresContext } from "@/context/GenresContext";

interface HorizontalCarouselSectionProps {
    CarouselRef: React.RefObject<HTMLDivElement | null>;
    data: SearchResult[];
    setCanScrollLeft: (val: boolean) => void;
    setCanScrollRight: (val: boolean) => void;
    mediaType?: "movie" | "tv",
}

function handleScroll(
    ref: React.RefObject<HTMLDivElement | null>,
    setCanScrollLeft: (val: boolean) => void,
    setCanScrollRight: (val: boolean) => void,
) {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
}

export default function HorizontalCarouselSection({
    CarouselRef,
    data,
    setCanScrollLeft,
    setCanScrollRight,
    mediaType,
}: HorizontalCarouselSectionProps) {
    const router = useRouter();

    const { genresMap } = useGenresContext();

    return (
        <div className="relative group -mx-4 px-4">
            <div
                ref={CarouselRef}
                onScroll={() =>
                    handleScroll(CarouselRef, setCanScrollLeft, setCanScrollRight)
                }
                className="flex gap-6 overflow-x-auto w-full py-6 -my-2 snap-x snap-mandatory scrollbar-hide"
            >
                {data.map((item) => {
                    const itemGenres = item.genre_ids
                        .map(
                            (id) =>
                                genresMap.movieGenres[id] ||
                                genresMap.tvGenres[id],
                        )
                        .filter((name): name is string => Boolean(name));
                    return (
                        <div
                            key={item.id}
                            tabIndex={0}
                            className="group/slice snap-start flex-none w-56 sm:w-64 md:w-72 h-105 outline-none focus:scale-[1.01] transition-transform"
                        >
                            <Card
                                item={item}
                                genres={itemGenres}
                                onClick={() =>
                                    detailsRouter(
                                        router,
                                        item.id,
                                        item.media_type || mediaType
                                    )
                                }
                                className="group-first/slice:origin-left group-last/slice:origin-right"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
