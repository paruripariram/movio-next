"use client";

import Card from "@/components/Card";
import SearchInput from "@/components/SearchInput";
import useMovieSearch from "@/hooks/useMovieSearch";
import Toggler from "@/components/Toggler";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import GenreCheckbox from "@/components/GenreCheckbox";
import {detailsRouter} from "@/helpers/detailsRouter";
import Loader from "@/components/Loader";
import { useEffect } from "react";
import { useGenresStore } from "@/store/genreStore";

export default function Search() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const genresMap = useGenresStore((state) => state.genresMap);

    const searchQuery = searchParams.get("with_text_query") || "";
    const withGenres = searchParams.get("with_genres") || "";
    
    useEffect(() => {
        if (!pathname.includes("/search")) return;
        if (!searchParams.has("type")) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("type", "movie");
            router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
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
    const {
        searchResults,
        isLoading,
        error,
        setError,
        isDebouncing,
        page,
        setPage,
        hasMore,
        setRetryCount,
    } = useMovieSearch(searchQuery, currentType as "movie" | "tv", withGenres);
    const isFirstPageLoading = (isLoading || isDebouncing) && page === 1;

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

    return (
        <>
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
                        </div>
                    </aside>
                    <div className="flex-1 min-w-0 flex flex-col">
                        {searchQuery.trim() === "" &&
                            searchParams.get("with_genres") === "" && (
                                <p className="text-gray-500 text-3xl px-6">
                                    Популярное сейчас.
                                </p>
                            )}
                        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-6 justify-items-center">
                            {error && (
                                <div className="col-span-full flex flex-col items-center py-10 gap-4">
                                    <p className="flex w-60 h-20 border-zinc-800 text-zinc-400 text-3xl text-center">
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

                            {(searchQuery.trim() !== "" ||
                                pickedGenres.length > 0) &&
                                searchResults.length === 0 &&
                                !isDebouncing &&
                                !isLoading &&
                                !error && (
                                    <p className="text-gray-500 text-3xl">
                                        Ничего не найдено для{" "}
                                        {searchQuery
                                            ? `"${searchQuery}"`
                                            : "выбранных жанров"}
                                        .
                                    </p>
                                )}
                            {isFirstPageLoading && <Loader size="medium">Загрузка результатов...</Loader>}
                            {searchResults.length > 0 &&
                                !isFirstPageLoading &&
                                searchResults.map((item) => {
                                    return (
                                        <Card
                                            key={item.id}
                                            item={item}
                                            onClick={() =>
                                                detailsRouter(
                                                    router,
                                                    item.id,
                                                    currentType as
                                                        | "movie"
                                                        | "tv",
                                                )
                                            }
                                        />
                                    );
                                })}
                        </div>
                        {hasMore && !isFirstPageLoading && (
                            <button
                                disabled={isLoading}
                                className="self-center mt-6 bg-primary text-white w-40 h-12 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold"
                                onClick={() =>
                                    setPage((prevPage) => prevPage + 1)
                                }
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
            </div>
        </>
    );
}