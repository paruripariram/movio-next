"use client";

import Card from "@/components/media/Card";
import SearchInput from "@/components/ui/SearchInput";
import useMovieSearch from "@/hooks/useMovieSearch";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { detailsRouter } from "@/helpers/detailsRouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchCacheStore } from "@/store/searchCacheStore";
import { useUrlFilters } from "@/hooks/useUrlFilteres";
import CardSceleton from "@/components/ui/sceletons/CardSceleton";
import FilterSidebar from "@/components/filteres/FilterSidebar";
import { SlidersHorizontal } from "lucide-react";
import MobileDrawer from "@/components/ui/MobileDrawer";

export default function Search() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const {
        query,
        type: currentType,
        pickedGenres,
        updateParams,
        toggleGenre,
    } = useUrlFilters();

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const setCache = useSearchCacheStore((state) => state.setCache);

    const withGenres = searchParams.get("with_genres") || "";

    useEffect(() => {
        if (!pathname.includes("/search")) return;
        if (!searchParams.has("type")) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("type", "movie");
            router.replace(`${pathname}?${nextParams.toString()}`, {
                scroll: false,
            });
        }
    }, [searchParams, pathname, router]);

    const {
        searchResults,
        isLoading,
        error,
        setError,
        isDebouncing,
        setPage,
        hasMore,
        setRetryCount,
        hasSearched,
        isInitialLoading,
        page,
    } = useMovieSearch(query, currentType as "movie" | "tv", withGenres);
    const isSearching = isLoading || isDebouncing || isInitialLoading;

    const [localSearch, setLocalSearch] = useState(
        searchParams.get("with_text_query") || "",
    );

    const [prevQuery, setPrevQuery] = useState(query);

    if (query !== prevQuery) {
        setPrevQuery(query);
        setLocalSearch(query);
    }

    useEffect(() => {
        if (localSearch === query) return;

        const timer = setTimeout(() => {
            updateParams({
                with_text_query: localSearch.trim() !== "" ? localSearch : null,
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [localSearch, updateParams, query]);

    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setLocalSearch(e.target.value);
    }

    function typeHandler(newType: string) {
        updateParams({ type: newType, with_genres: null });
    }

    useEffect(() => {
        const savedScrollY = useSearchCacheStore.getState().cachedScrollY;
        if (savedScrollY && savedScrollY > 0) {
            const timer = setTimeout(() => {
                window.scrollTo({ top: savedScrollY, behavior: "instant" });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="flex flex-col gap-4 md:gap-10 w-full max-w-full ">
            <div className="flex gap-3">
                <div className="flex-1">
                    <SearchInput value={localSearch} onChange={inputHandler} />
                </div>
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center justify-center w-13 h-13 bg-form-color rounded-xl text-white shrink-0 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)]"
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0">
                <div className="hidden lg:block">
                    <FilterSidebar
                        currentType={currentType}
                        pickedGenres={pickedGenres}
                        typeHandler={typeHandler}
                        toggleGenre={toggleGenre}
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                    {query.trim() === "" &&
                        searchParams.get("with_genres") === "" && (
                            <p className="text-gray-500 text-xl sm:text-3xl px-2 sm:px-6 mb-2 sm:mb-0">
                                Популярное сейчас.
                            </p>
                        )}

                    <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-6 p-2 sm:p-6 justify-items-center">
                        {error && (
                            <div className="col-span-full flex flex-col items-center py-10 gap-4">
                                <p className="text-zinc-400 text-xl sm:text-3xl text-center max-w-xs sm:max-w-md">
                                    Не удалось загрузить результаты.
                                </p>
                                <button
                                    className="bg-primary text-white w-40 h-12 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold"
                                    onClick={() => {
                                        setError(null);
                                        setRetryCount((prev) => prev + 1);
                                    }}
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        )}

                        {(query.trim() !== "" || pickedGenres.length > 0) &&
                            hasSearched &&
                            searchResults.length === 0 &&
                            !isDebouncing &&
                            !isLoading &&
                            !error && (
                                <p className="text-gray-500 text-xl sm:text-3xl col-span-full py-10 text-center">
                                    Ничего не найдено для{" "}
                                    {query ? `"${query}"` : "выбранных жанров"}.
                                </p>
                            )}

                        {isSearching &&
                            page === 1 &&
                            Array.from({ length: 20 }).map((item, index) => {
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                        }}
                                        className="w-full min-w-0 flex justify-center"
                                    >
                                        <CardSceleton />
                                    </motion.div>
                                );
                            })}

                        {searchResults.length > 0 &&
                            !(isSearching && page === 1) &&
                            searchResults.map((item) => {
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                        }}
                                        className="w-full min-w-0 flex justify-center"
                                    >
                                        <Card
                                            item={item}
                                            onClick={() => {
                                                setCache({
                                                    cachedScrollY:
                                                        window.scrollY,
                                                });
                                                detailsRouter(
                                                    router,
                                                    item.id,
                                                    currentType as
                                                        | "movie"
                                                        | "tv",
                                                );
                                            }}
                                        />
                                    </motion.div>
                                );
                            })}
                    </div>

                    {hasMore && !(isSearching && page === 1) && (
                        <button
                            disabled={isLoading}
                            className="self-center my-6 bg-primary text-white w-40 h-12 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold"
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Показать еще"
                            )}
                        </button>
                    )}
                </div>
            </div>
            <MobileDrawer
                isOpen={isMobileFiltersOpen}
                onClose={() => setIsMobileFiltersOpen(false)}
                title="Фильтры"
            >
                <FilterSidebar
                    isMobile={true}
                    currentType={currentType}
                    pickedGenres={pickedGenres}
                    typeHandler={typeHandler}
                    toggleGenre={toggleGenre}
                />
            </MobileDrawer>
        </div>
    );
}
