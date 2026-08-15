import { Bookmark, Check } from "lucide-react";
import Toggler from "./Toggler";
import { useGenresStore } from "@/store/genreStore";
import GenreCheckbox from "./GenreCheckbox";
import { GenreStatus } from "@/types/tmdb";
import FilterSlider from "./FilterSlider";
import { SLIDER_CONFIG } from "@/config/filters";
import { FilterSelect } from "./FilterSelect";

interface FilterSidebarProps {
    collectionPage?: boolean;
    currentStatus?: string;
    currentType: string;
    pickedWithGenres: number[];
    pickedWithoutGenres: number[];
    releaseDateGte: string;
    releaseDateLte: string;
    voteAverageGte: string;
    voteAverageLte: string;
    statusHandler?: (value: string) => void;
    typeHandler: (value: string) => void;
    toggleGenre: (genreId: number, nextStatus: GenreStatus) => void;
    onChangeSliderValue: (
        type: "release_date" | "vote_average",
        value: number[],
    ) => void;
    onValueChangeSelect: (type: "sortBy", value: string) => void;
    valueSortBy: string;
    resetFilters: () => void;
    selectType: "sortBy" | "collectionSortBy"
    isMobile?: boolean;
}

const togglerStatusOptions = [
    { value: "all", label: "Все" },
    {
        value: "watched",
        label: <Check className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
        value: "wishlist",
        label: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
];

const togglerMediaOptions = [
    { value: "movie", label: "Фильмы" },
    { value: "tv", label: "Сериалы" },
];

const parseYear = (value: string, fallback: number): number => {
    if (!value) return fallback;
    const year = parseInt(value, 10);
    return Number.isNaN(year) ? fallback : year;
};

export default function FilterSidebar({
    collectionPage = false,
    currentStatus = "all",
    currentType,
    pickedWithGenres,
    pickedWithoutGenres,
    releaseDateGte,
    releaseDateLte,
    voteAverageGte,
    voteAverageLte,
    valueSortBy,
    onValueChangeSelect,
    statusHandler,
    typeHandler,
    toggleGenre,
    onChangeSliderValue,
    resetFilters,
    selectType,
    isMobile = false,
}: FilterSidebarProps) {
    const genresMap = useGenresStore((state) => state.genresMap);
    const currentGenres =
        currentType === "movie" ? genresMap?.movieGenres : genresMap?.tvGenres;

    const withSet = new Set(pickedWithGenres);
    const withoutSet = new Set(pickedWithoutGenres);

    const dateValues: [number, number] = [
        parseYear(releaseDateGte, SLIDER_CONFIG.release_date.min),
        parseYear(releaseDateLte, SLIDER_CONFIG.release_date.max),
    ];

    const ratingValues: [number, number] = [
        voteAverageGte
            ? Number(voteAverageGte)
            : SLIDER_CONFIG.vote_average.min,
        voteAverageLte
            ? Number(voteAverageLte)
            : SLIDER_CONFIG.vote_average.max,
    ];

    return (
        <aside
            className={
                isMobile
                    ? "w-full text-white flex flex-col gap-6"
                    : "sticky top-10 bg-form-color shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)] text-white w-full lg:w-70 h-auto self-start rounded-2xl md:rounded-4xl shrink-0 p-4 sm:p-5 flex flex-col gap-6"
            }
        >
            <div className="flex items-center justify-between">
                {!isMobile && <h1 className="text-2xl font-bold">Фильтры</h1>}
                <button
                    onClick={resetFilters}
                    className="text-md font-semibold bg-primary rounded-2xl px-3 py-2 hover:bg-bgcolor transition duration-300 cursor-pointer"
                >
                    Сбросить
                </button>
            </div>


            <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-3 sm:gap-4">
                {collectionPage && statusHandler && (
                    <div className="w-full sm:w-60">
                        <Toggler
                            options={togglerStatusOptions}
                            value={currentStatus}
                            optionHandler={statusHandler}
                        />
                    </div>
                )}
                <div className="w-full sm:w-60">
                    <Toggler
                        options={togglerMediaOptions}
                        value={currentType as "movie" | "tv"}
                        optionHandler={typeHandler}
                    />
                </div>
            </div>
            
            <div>
                <FilterSelect
                    type={selectType}
                    value={valueSortBy}
                    onValueChange={(value) =>
                        onValueChangeSelect("sortBy", value)
                    }
                />
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-60">
                    <FilterSlider
                        key={`date-${dateValues.join(" - ")}`}
                        type="release_date"
                        value={dateValues}
                        onValueCommit={(value) =>
                            onChangeSliderValue("release_date", value)
                        }
                    />
                </div>
                <div className="w-full sm:w-60">
                    <FilterSlider
                        key={`rating-${ratingValues.join(" - ")}`}
                        type="vote_average"
                        value={ratingValues}
                        onValueCommit={(value) =>
                            onChangeSliderValue("vote_average", value)
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3.5 max-h-48 lg:max-h-none overflow-y-auto pr-1">
                {currentGenres &&
                    Object.entries(currentGenres).map(([id, name]) => (
                        <GenreCheckbox
                            key={id}
                            genreId={Number(id)}
                            name={name}
                            status={
                                withSet.has(Number(id))
                                    ? "include"
                                    : withoutSet.has(Number(id))
                                      ? "exclude"
                                      : "neutral"
                            }
                            onChange={toggleGenre}
                        />
                    ))}
            </div>
        </aside>
    );
}
