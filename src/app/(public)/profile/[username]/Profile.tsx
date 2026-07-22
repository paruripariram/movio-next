"use client";

import { signOut } from "next-auth/react";
import Loader from "@/components/Loader";
import { APP_ROUTES } from "@/config/routes";
import { handleError } from "@/helpers/errorHandler";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { getRank } from "@/helpers/ranks";
import { userService } from "@/services/database/firebase/userService";
import { useEffect, useMemo, useState } from "react";
import {
    Bookmark,
    Calendar,
    ChartPie,
    Clapperboard,
    Heart,
    TvMinimal,
} from "lucide-react";
import { useGenresStore } from "@/store/genreStore";
import { getTopGenre } from "@/helpers/getTopGenre";
import { GenrePieChart } from "@/components/GenrePieChart";
import { getRecentlyWatched } from "@/helpers/getRecentlyWatched";
import HorizontalCarouselSection from "@/components/HorizontalCarouselSection";
import { getPluralWord } from "@/helpers/pluralize";

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

    const genresMap = useGenresStore((state) => state.genresMap);

    const collectionArr = useCollectionStore((state) => state.collectionArr);
    const isLoadingCollection = useCollectionStore(
        (state) => state.isLoadingCollection,
    );

    async function handleLogout() {
        try {
            await signOut({ callbackUrl: APP_ROUTES.SIGNIN.path });
        } catch (error) {
            handleError(error, "Ошибка при выходе из аккаунта");
        }
    }

    const [createdAt, setCreatedAt] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchCreatedAt() {
            if (!user?.id) return;
            try {
                const date = await userService.getCreatedAt(user.id);
                if (isMounted) setCreatedAt(date);
            } catch (error) {
                handleError(
                    error,
                    "Ошибка при получении даты создания аккаунта",
                );
            }
        }
        fetchCreatedAt();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    const stats = useMemo(() => {
        const watched = collectionArr.filter(
            (item) => item.status === "watched",
        );
        const wishlist = collectionArr.filter(
            (item) => item.status === "wishlist",
        );

        const watchedMovies = watched.filter(
            (item) => item.type === "movie",
        ).length;
        const watchedTv = watched.filter((item) => item.type === "tv").length;

        const totalWatched = watched.length;
        const totalWishlist = wishlist.length;

        const isTvDominant = watchedTv > watchedMovies;
        const dominantCount = isTvDominant ? watchedTv : watchedMovies;
        const dominantPercentage =
            totalWatched > 0
                ? Math.round((dominantCount / totalWatched) * 100)
                : 0;

        const rankData = getRank(totalWatched);
        const topGenreData = getTopGenre(watched, genresMap);
        const recent = getRecentlyWatched(collectionArr, 5);

        return {
            watched,
            wishlist,
            watchedMovies,
            watchedTv,
            totalWatched,
            totalWishlist,
            isTvDominant,
            dominantPercentage,
            rankData,
            topGenreData,
            recent,
        };
    }, [collectionArr, genresMap]);

    if (isLoadingUser) {
        return (
            <div className="flex w-full min-h-[70vh] items-center justify-center">
                <Loader size="large">Аутентификация...</Loader>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 lg:px-8 py-6">
            {user && (
                <div className="flex flex-col gap-8 sm:gap-10">
                    <div className="flex flex-col gap-6 bg-form-color shadow-lg rounded-3xl w-full p-6 sm:p-8 lg:p-10 border border-white/5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full sm:w-auto">
                                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl font-bold bg-primary text-white shadow-glow-bold shrink-0 overflow-hidden relative">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        (user.name
                                            ? user.name.charAt(0)
                                            : user.email?.charAt(0) || "?"
                                        ).toUpperCase()
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
                                            {user.name || user.email}
                                        </h1>

                                        {stats.rankData && (
                                            <div
                                                className={`${stats.rankData.bgColor} ${stats.rankData.borderColor} ${stats.rankData.textColor} border px-3.5 py-1 rounded-full flex items-center justify-center shrink-0`}
                                            >
                                                <p className="text-xs sm:text-sm font-bold whitespace-nowrap">
                                                    {stats.rankData.title}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {createdAt && (
                                        <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                                            <Calendar className="w-4 h-4 shrink-0" />
                                            <p>В коллекции с {createdAt}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            className="bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-semibold py-2.5 px-6 rounded-xl w-full sm:w-auto self-start transition duration-200 text-sm"
                            onClick={handleLogout}
                        >
                            Выйти из аккаунта
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 relative">
                        {isLoadingCollection && (
                            <div className="absolute inset-0 bg-form-color/60 backdrop-blur-xs z-10 rounded-3xl flex items-center justify-center">
                                <Loader size="medium">
                                    Загрузка коллекции...
                                </Loader>
                            </div>
                        )}

                        <div className="bg-form-color shadow-lg rounded-3xl p-5 sm:p-6 min-h-45 relative flex flex-col justify-between gap-4 border border-white/5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="bg-primary/20 text-primary p-2.5 rounded-xl shrink-0">
                                    <Clapperboard className="w-5 h-5" />
                                </div>
                                <span className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-right whitespace-nowrap">
                                    Статистика
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1">
                                    всего просмотрено
                                </p>
                                <p className="text-gray-300 font-bold text-sm">
                                    <span className="text-white text-2xl font-black mr-1">
                                        {stats.watchedMovies}
                                    </span>
                                    {getPluralWord(
                                        stats.watchedMovies,
                                        "фильм",
                                        "фильма",
                                        "фильмов",
                                    )}{" "}
                                    /{" "}
                                    <span className="text-white text-2xl font-black mr-1">
                                        {stats.watchedTv}
                                    </span>
                                    {getPluralWord(
                                        stats.watchedTv,
                                        "сериал",
                                        "сериала",
                                        "сериалов",
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="bg-form-color shadow-lg rounded-3xl p-5 sm:p-6 min-h-45 relative flex flex-col justify-between gap-4 border border-white/5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="bg-yellow-500/20 text-yellow-500 p-2.5 rounded-xl shrink-0">
                                    <TvMinimal className="w-5 h-5" />
                                </div>
                                <span className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-right whitespace-nowrap">
                                    Предпочтение
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1">
                                    чаще смотрите
                                </p>
                                <p className="text-white text-xl font-bold">
                                    {stats.isTvDominant
                                        ? "Сериаломан"
                                        : "Фильмоман"}
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                    в коллекции {stats.dominantPercentage}%{" "}
                                    {stats.isTvDominant
                                        ? "сериалов"
                                        : "фильмов"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-form-color shadow-lg rounded-3xl p-5 sm:p-6 min-h-45 relative flex flex-col justify-between gap-4 border border-white/5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="bg-primary/20 text-primary p-2.5 rounded-xl shrink-0">
                                    <Bookmark className="w-5 h-5" />
                                </div>
                                <span className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-right whitespace-nowrap">
                                    В очереди
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1">
                                    в списке желаний
                                </p>
                                <p className="text-gray-300 font-bold text-sm">
                                    <span className="text-white text-2xl font-black mr-1.5">
                                        {stats.totalWishlist}
                                    </span>
                                    {getPluralWord(
                                        stats.totalWishlist,
                                        "проект",
                                        "проекта",
                                        "проектов",
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="bg-form-color shadow-lg rounded-3xl p-5 sm:p-6 min-h-45 relative flex flex-col justify-between gap-4 border border-white/5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="bg-red-500/20 text-red-500 p-2.5 rounded-xl shrink-0">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-right whitespace-nowrap">
                                    Избранное
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1">
                                    любимый жанр
                                </p>
                                <p className="text-white text-xl font-bold truncate">
                                    {stats.topGenreData.genreName ||
                                        "Не определен"}
                                </p>
                                {stats.topGenreData.genreName !==
                                    "Не определен" && (
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        встречается в{" "}
                                        {stats.topGenreData.percentage}% вашей
                                        коллекции
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 bg-form-color shadow-lg rounded-3xl w-full p-6 sm:p-8 border border-white/5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-lg font-bold">
                                Распределение жанров
                            </h2>
                            <ChartPie className="text-gray-400 w-5 h-5" />
                        </div>
                        <div className="w-full min-h-65 flex items-center justify-center">
                            <GenrePieChart items={stats.watched} />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {stats.recent.length === 0 ? (
                            <p className="text-gray-500 text-base sm:text-lg px-2">
                                Вы еще ничего не просмотрели.
                            </p>
                        ) : (
                            <HorizontalCarouselSection
                                data={stats.recent}
                                title="Недавно просмотрено"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
