"use client";

import { Bookmark, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "@/components/Card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { detailsRouter } from "@/helpers/detailsRouter";
import Loader from "@/components/Loader";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";
import SearchInput from "@/components/SearchInput";
import { useSearchCacheStore } from "@/store/searchCacheStore";
import { useGenresStore } from "@/store/genreStore";
import { useEffect, useMemo, useState } from "react";
import GenreCheckbox from "@/components/GenreCheckbox";
import Toggler from "@/components/Toggler";
import { useUrlFilters } from "@/hooks/useUrlFilteres";

export default function Collection() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { isLoadingUser } = useAuthStore();

    const [initialPathname] = useState(pathname);
    const isNavigatingAway = pathname !== initialPathname;

    const {
        query: queryFromUrl,
        type: currentType,
        status: currentStatus,
        pickedGenres,
        updateParams,
        toggleGenre,
    } = useUrlFilters();

    const genresMap = useGenresStore((state) => state.genresMap);
    const setCache = useSearchCacheStore((state) => state.setCache);

    const [localSearch, setLocalSearch] = useState(
        searchParams.get("with_text_query") || "",
    );

    const [prevQuery, setPrevQuery] = useState(queryFromUrl);

    if (queryFromUrl !== prevQuery && !isNavigatingAway) {
        setPrevQuery(queryFromUrl);
        setLocalSearch(queryFromUrl);
    }

    const currentGenresStr = JSON.stringify(pickedGenres);
    const [activeFilters, setActiveFilters] = useState({
        currentType,
        localSearch,
        currentStatus,
        pickedGenresStr: currentGenresStr,
    });

    if (
        !isNavigatingAway &&
        (currentType !== activeFilters.currentType ||
            localSearch !== activeFilters.localSearch ||
            currentStatus !== activeFilters.currentStatus ||
            currentGenresStr !== activeFilters.pickedGenresStr)
    ) {
        setActiveFilters({
            currentType,
            localSearch,
            currentStatus,
            pickedGenresStr: currentGenresStr,
        });
    }

    useEffect(() => {
        if (isNavigatingAway) return;
        const timer = setTimeout(() => {
            updateParams({
                with_text_query: localSearch.trim() !== "" ? localSearch : null,
            });
        }, 400);
        return () => clearTimeout(timer);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearch, isNavigatingAway]);

    useEffect(() => {
        if (isNavigatingAway) return;
        if (!pathname.includes("/collection")) return;
        if (!searchParams.has("type")) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("type", "movie");
            router.replace(`${pathname}?${nextParams.toString()}`, {
                scroll: false,
            });
        }
    }, [searchParams, pathname, router, isNavigatingAway]);

    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setLocalSearch(e.target.value);
    }

    function typeHandler(newType: string) {
        updateParams({ type: newType, with_genres: null });
    }

    function statusHandler(newStatus: string) {
        updateParams({ status: newStatus === "all" ? null : newStatus });
    }

    const collectionArr = useCollectionStore((state) => state.collectionArr);

    const isLoadingCollection = useCollectionStore(
        (state) => state.isLoadingCollection,
    );
    const criticalError = useCollectionStore((state) => state.criticalError);

    const filteredCollection = useMemo(() => {
        const genresList = JSON.parse(
            activeFilters.pickedGenresStr,
        ) as number[];

        return collectionArr.filter((item) => {
            if (item.type !== activeFilters.currentType) return false;

            if (activeFilters.localSearch.trim() !== "") {
                const title = item.title || "";
                if (
                    !title
                        .toLowerCase()
                        .includes(activeFilters.localSearch.toLowerCase())
                )
                    return false;
            }

            if (genresList.length > 0) {
                const itemGenres = item.genre_ids || [];
                const hasAllGenres = genresList.every((id) =>
                    itemGenres.includes(id),
                );
                if (!hasAllGenres) return false;
            }

            if (
                activeFilters.currentStatus !== "all" &&
                item.status !== activeFilters.currentStatus
            )
                return false;

            return true;
        });
    }, [collectionArr, activeFilters]);

    if (criticalError) throw criticalError;

    const viewKey =
        isLoadingUser || isLoadingCollection
            ? "loading"
            : collectionArr.length === 0
              ? "empty"
              : "filled";

    useEffect(() => {
        if (viewKey === "filled") {
            const savedScrollY =
                useSearchCacheStore.getState().cachedCollectionScrollY;
            if (savedScrollY && savedScrollY > 0) {
                const timer = setTimeout(() => {
                    window.scrollTo({ top: savedScrollY, behavior: "instant" });
                }, 50);
                return () => clearTimeout(timer);
            }
        }
    }, [viewKey]);

    const togglerStatusOptions = [
        { value: "all", label: "Все" },
        { value: "watched", label: <Check /> },
        { value: "wishlist", label: <Bookmark /> },
    ];

    const togglerMediaOptions = [
        { value: "movie", label: "Фильмы" },
        { value: "tv", label: "Сериалы" },
    ];

    return (
        <div className="flex flex-col gap-10">
            <SearchInput value={localSearch} onChange={inputHandler} />
            <div className="flex">
                <aside className="bg-form-color shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)] text-white w-70 h-auto self-start rounded-4xl shrink-0 p-5">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="w-60">
                            <Toggler
                                options={togglerStatusOptions}
                                value={currentStatus}
                                optionHandler={statusHandler}
                            />
                        </div>
                        <div className="w-60">
                            <Toggler
                                options={togglerMediaOptions}
                                value={currentType as "movie" | "tv"}
                                optionHandler={typeHandler}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-6">
                        {currentType === "movie"
                            ? Object.entries(genresMap.movieGenres).map(
                                  ([id, name]) => (
                                      <GenreCheckbox
                                          key={id}
                                          genreId={Number(id)}
                                          name={name}
                                          checked={pickedGenres.includes(
                                              Number(id),
                                          )}
                                          onChange={toggleGenre}
                                      />
                                  ),
                              )
                            : Object.entries(genresMap.tvGenres).map(
                                  ([id, name]) => (
                                      <GenreCheckbox
                                          key={id}
                                          genreId={Number(id)}
                                          name={name}
                                          checked={pickedGenres.includes(
                                              Number(id),
                                          )}
                                          onChange={toggleGenre}
                                      />
                                  ),
                              )}
                    </div>{" "}
                </aside>
                <div className="flex-1 min-w-0 flex flex-col">
                    <AnimatePresence mode="wait">
                        {viewKey === "loading" && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center"
                            >
                                <Loader size="large">
                                    Загрузка коллекции...
                                </Loader>
                            </motion.div>
                        )}
                        {viewKey === "empty" && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center"
                            >
                                <p className="text-gray-500 text-3xl px-6">
                                    Ваша коллекция пуста.
                                </p>
                            </motion.div>
                        )}
                        {viewKey === "filled" && (
                            <motion.div
                                key="filled"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col"
                            >
                                <p className="text-gray-500 text-3xl px-6">
                                    Ваша коллекция.
                                </p>

                                <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-6 justify-items-center">
                                    <AnimatePresence mode="popLayout">
                                        {filteredCollection.length === 0 && (
                                            <p className="text-gray-500 text-2xl col-span-full py-10">
                                                Ничего не найдено по выбранным
                                                фильтрам.
                                            </p>
                                        )}
                                        {filteredCollection.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout="position"
                                                className="w-full"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 40,
                                                    opacity: { duration: 0.2 },
                                                }}
                                            >
                                                <Card
                                                    item={item}
                                                    onClick={() => {
                                                        setCache({
                                                            cachedCollectionScrollY:
                                                                window.scrollY,
                                                        });
                                                        detailsRouter(
                                                            router,
                                                            item.id,
                                                            item.type,
                                                        );
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
