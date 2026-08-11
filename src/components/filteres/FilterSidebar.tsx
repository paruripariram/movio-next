import { Bookmark, Check } from "lucide-react";
import Toggler from "../ui/Toggler";
import { useGenresStore } from "@/store/genreStore";
import GenreCheckbox from "./GenreCheckbox";

interface FilterSidebarProps {
    collectionPage?: boolean;
    currentStatus?: string;
    currentType: string;
    pickedGenres: number[];
    statusHandler?: (value: string) => void;
    typeHandler: (value: string) => void;
    toggleGenre: (genreId: number, checked: boolean) => void;
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

export default function FilterSidebar({
    collectionPage = false,
    currentStatus = "all",
    currentType,
    pickedGenres,
    statusHandler,
    typeHandler,
    toggleGenre,
    isMobile = false,
}: FilterSidebarProps) {
    const genresMap = useGenresStore((state) => state.genresMap);
    const currentGenres =
        currentType === "movie" ? genresMap?.movieGenres : genresMap?.tvGenres;

    return (
        <aside className={
                isMobile
                    ? "w-full text-white"
                    : "sticky top-10 bg-form-color shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)] text-white w-full lg:w-70 h-auto self-start rounded-2xl md:rounded-4xl shrink-0 p-4 sm:p-5"
            }>
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

            <div className="flex flex-col gap-3.5 mt-4 lg:mt-6 max-h-48 lg:max-h-none overflow-y-auto pr-1">
                {currentGenres &&
                    Object.entries(currentGenres).map(([id, name]) => (
                        <GenreCheckbox
                            key={id}
                            genreId={Number(id)}
                            name={name}
                            checked={pickedGenres.includes(Number(id))}
                            onChange={toggleGenre}
                        />
                    ))}
            </div>
        </aside>
    );
}
