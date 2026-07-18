"use client";

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
import { useEffect } from "react";
import GenreCheckbox from "@/components/GenreCheckbox";
import Toggler from "@/components/Toggler";

export default function Collection() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { isLoadingUser } = useAuthStore();

    const genresMap = useGenresStore((state) => state.genresMap);
    const setCache = useSearchCacheStore((state) => state.setCache);

    const searchQuery = searchParams.get("with_text_query") || "";
    const withGenres = searchParams.get("with_genres") || "";

    useEffect(() => {
        if (!pathname.includes("/collection")) return;
        if (!searchParams.has("type")) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("type", "movie");
            router.replace(`${pathname}?${nextParams.toString()}`, {
                scroll: false,
            });
        }
    }, [searchParams, pathname, router]);

    const currentType = searchParams.get("type") || "movie";

    function setSearchParams(
        nextParams: Record<string, string> | URLSearchParams,
    ) {
        const currentParams = new URLSearchParams(searchParams);

        const entries =
            nextParams instanceof URLSearchParams
                ? Array.from(nextParams.entries())
                : Object.entries(nextParams);

        entries.forEach(([key, value]) => {
            if (value) {
                currentParams.set(key, value);
            } else {
                currentParams.delete(key);
            }
        });

        const searchStr = currentParams.toString();
        const newSearchStr = searchStr ? `?${searchStr}` : "";

        router.push(`${pathname}${newSearchStr}`, {
            scroll: false,
        });
    }

    const pickedGenres = withGenres
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "")
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);

    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("with_text_query", e.target.value);
        setSearchParams(nextParams);
    }

    function typeHandler() {
        const newType = searchParams.get("type") === "movie" ? "tv" : "movie";
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("type", newType);
        nextParams.set("with_genres", "");
        setSearchParams(nextParams);
    }

    function genreHandler(genreId: number, checked: boolean) {
        const newGenres = checked
            ? [...pickedGenres, genreId]
            : pickedGenres.filter((id) => id !== genreId);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("with_genres", newGenres.join(","));
        setSearchParams(nextParams);
    }
    const collectionArr = useCollectionStore((state) => state.collectionArr);

    const isLoadingCollection = useCollectionStore(
        (state) => state.isLoadingCollection,
    );
    const criticalError = useCollectionStore((state) => state.criticalError);

    const filteredCollection = collectionArr.filter((item) => {
        if (item.type !== currentType) return false;

        if (searchQuery.trim() !== "") {
            const title = item.title || "";
            if (!title.toLowerCase().includes(searchQuery.toLowerCase()))
                return false;
        }

        if (pickedGenres.length > 0) {
            const itemGenres = item.genre_ids || [];
            const hasAllGenres = pickedGenres.every((id) =>
                itemGenres.includes(id),
            );
            if (!hasAllGenres) return false;
        }

        return true;
    });

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
        <div className="flex flex-col gap-10">
            <SearchInput value={searchQuery} onChange={inputHandler} />
            <div className="flex">
                <aside className="bg-form-color shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)] text-white w-70 h-auto self-start rounded-4xl shrink-0 p-5">
                    <Toggler
                        type={currentType as "movie" | "tv"}
                        typeHandler={typeHandler}
                    />
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
                                          onChange={genreHandler}
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
                                          onChange={genreHandler}
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
                                    Ваша коллекця пуста.
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
