"use client";

import { AnimatePresence, motion } from "framer-motion";
import Card from "@/components/media/Card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { detailsRouter } from "@/helpers/detailsRouter";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";
import SearchInput from "@/components/ui/SearchInput";
import { useSearchCacheStore } from "@/store/searchCacheStore";
import { useEffect, useMemo, useState } from "react";
import { useUrlFilters } from "@/hooks/useUrlFilteres";
import CardSceleton from "@/components/ui/sceletons/CardSceleton";
import FilterSidebar from "@/components/filteres/FilterSidebar";
import { SlidersHorizontal } from "lucide-react";
import MobileDrawer from "@/components/ui/MobileDrawer";

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

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const setCache = useSearchCacheStore((state) => state.setCache);

    const [localSearch, setLocalSearch] = useState(
        searchParams.get("with_text_query") || "",
    );

    const [prevQuery, setPrevQuery] = useState(queryFromUrl);

    if (queryFromUrl !== prevQuery && !isNavigatingAway) {
        setPrevQuery(queryFromUrl);
        setLocalSearch(queryFromUrl);
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
        return collectionArr.filter((item) => {
            if (item.type !== currentType) return false;

            if (localSearch.trim() !== "") {
                const title = item.title || "";
                if (!title.toLowerCase().includes(localSearch.toLowerCase()))
                    return false;
            }

            if (pickedGenres.length > 0) {
                const itemGenres = item.genre_ids || [];
                const hasAllGenres = pickedGenres.every((id) =>
                    itemGenres.includes(id),
                );
                if (!hasAllGenres) return false;
            }

            if (currentStatus !== "all" && item.status !== currentStatus)
                return false;

            return true;
        });
    }, [collectionArr, currentType, localSearch, pickedGenres, currentStatus]);

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

    return (
        <div className="flex flex-col gap-4 md:gap-10 w-full max-w-full">
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
                        collectionPage={true}
                        currentStatus={currentStatus}
                        currentType={currentType}
                        pickedGenres={pickedGenres}
                        statusHandler={statusHandler}
                        typeHandler={typeHandler}
                        toggleGenre={toggleGenre}
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                    <AnimatePresence mode="wait">
                        {viewKey === "loading" && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col min-w-0"
                            >
                                <p className="text-gray-500 text-xl sm:text-3xl px-2 sm:px-6 mb-2 sm:mb-0">
                                    Ваша коллекция.
                                </p>

                                <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-6 p-2 sm:p-6 justify-items-center">
                                    <AnimatePresence mode="popLayout">
                                        {Array.from({ length: 20 }).map(
                                            (item, index) => (
                                                <motion.div
                                                    key={index}
                                                    layout="position"
                                                    className="w-full min-w-0 flex justify-center"
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
                                                        opacity: {
                                                            duration: 0.2,
                                                        },
                                                    }}
                                                >
                                                    <CardSceleton />
                                                </motion.div>
                                            ),
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                        {viewKey === "empty" && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center min-h-75"
                            >
                                <p className="text-gray-500 text-xl sm:text-3xl px-2 sm:px-6 text-center">
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
                                className="flex-1 flex flex-col min-w-0"
                            >
                                <p className="text-gray-500 text-xl sm:text-3xl px-2 sm:px-6 mb-2 sm:mb-0">
                                    Ваша коллекция.
                                </p>

                                <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-6 p-2 sm:p-6 justify-items-center">
                                    <AnimatePresence mode="popLayout">
                                        {filteredCollection.length === 0 && (
                                            <p
                                                key="empty-filter"
                                                className="text-gray-500 text-lg sm:text-2xl col-span-full py-10 text-center"
                                            >
                                                Ничего не найдено по выбранным
                                                фильтрам.
                                            </p>
                                        )}
                                        {filteredCollection.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout="position"
                                                className="w-full min-w-0 flex justify-center"
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
            <MobileDrawer
                isOpen={isMobileFiltersOpen}
                onClose={() => setIsMobileFiltersOpen(false)}
                title="Фильтры"
            >
                <FilterSidebar
                    isMobile={true}
                    collectionPage={true}
                    currentStatus={currentStatus}
                    currentType={currentType}
                    pickedGenres={pickedGenres}
                    statusHandler={statusHandler}
                    typeHandler={typeHandler}
                    toggleGenre={toggleGenre}
                />
            </MobileDrawer>
        </div>
    );
}
