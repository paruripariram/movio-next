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

        const ratio = totalWatched > 0 ? (watchedTv / totalWatched) * 100 : 0;

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
            ratio,
            rankData,
            topGenreData,
            recent,
        };
    }, [collectionArr, genresMap]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 lg:px-8">
            {isLoadingUser && <Loader size="large">Аутентификация...</Loader>}
            {isLoadingCollection && (
                <Loader size="medium">Загрузка вашей коллекции...</Loader>
            )}
            {!isLoadingUser && user && (
                <div className="flex flex-col gap-10">

                    <div className="flex flex-col gap-12 bg-form-color shadow-[4px_4px_10px_0px_rgba(15,15,15,15)] rounded-3xl w-full h-70 p-10">
                        <div className="flex items-center gap-5">
                            <div
                                className={`w-26 h-26 rounded-full flex items-center justify-center text-3xl ${"bg-gray-500 text-form-color"} bg-primary shadow-glow-bold`}
                            >
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt="Profile"
                                        width={100}
                                        height={100}
                                        className="rounded-full"
                                    />
                                ) : (
                                    (user.name
                                        ? user.name.charAt(0)
                                        : user.email?.charAt(0) || "?"
                                    ).toUpperCase()
                                )}
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                                <h1 className="text-white font-bold text-4xl">
                                    {" "}
                                    {user.name || user.email}
                                </h1>
                                <div className="flex items-center justify-center gap-1 text-gray-500">
                                    <Calendar />
                                    <p> В коллекции с {createdAt}</p>
                                </div>
                            </div>
                            <div
                                className={`${stats.rankData.bgColor} ${stats.rankData.borderColor} ${stats.rankData.textColor} h-10 py-2 px-3 rounded-full flex items-center justify-center`}
                            >
                                <p className="text-sm font-bold">
                                    {stats.rankData.title}
                                </p>
                            </div>
                        </div>
                        <button
                            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-2 rounded w-50 transition duration-200"
                            onClick={handleLogout}
                        >
                            Выйти из аккаунта
                        </button>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-6">
                        <div className="bg-form-color shadow-[4px_4px_10px_0px_rgba(15,15,15,15)] rounded-3xl p-8 h-55 relative flex flex-col gap-4">
                            <p className="absolute top-3 right-5 text-gray-500 font-bold">
                                Статистика
                            </p>
                            <div className="bg-primary/20 text-primary w-10 h-10 rounded-lg flex items-center justify-center">
                                <Clapperboard />
                            </div>
                            <div>
                                <p className="text-gray-500 font-bold">
                                    всего просмотрено
                                </p>
                                <p className="text-gray-500 font-bold">
                                    <span className="text-white text-2xl">
                                        {stats.watchedMovies}
                                    </span>{" "}
                                    фильмов/
                                </p>
                                <p className="text-gray-500 font-bold">
                                    <span className="text-white text-2xl">
                                        {stats.watchedTv}
                                    </span>{" "}
                                    сериалов
                                </p>
                            </div>
                        </div>

                        <div className="bg-form-color shadow-[4px_4px_10px_0px_rgba(15,15,15,15)] rounded-3xl p-8 h-55 relative flex flex-col gap-4">
                            <p className="absolute top-3 right-5 text-gray-500 font-bold">
                                Предпочтение
                            </p>
                            <div className="bg-yellow-500/20 text-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                <TvMinimal />
                            </div>
                            <div>
                                <p className="text-gray-500 font-bold">
                                    чаще смотрите
                                </p>
                                <span className="text-white text-2xl">
                                    {stats.ratio > 50
                                        ? "Сериаломан"
                                        : "Фильмоман"}
                                </span>
                                <p className="text-gray-500">
                                    {`в коллекции ${stats.ratio.toFixed(0)} ${stats.ratio > 50 ? "% сериалов" : "% фильмов"}`}
                                </p>
                            </div>
                        </div>

                        <div className="bg-form-color shadow-[4px_4px_10px_0px_rgba(15,15,15,15)] rounded-3xl p-8 h-55 relative flex flex-col gap-4">
                            <p className="absolute top-3 right-5 text-gray-500 font-bold">
                                В очереди
                            </p>
                            <div className="bg-primary/20 text-primary w-10 h-10 rounded-lg flex items-center justify-center">
                                <Bookmark />
                            </div>
                            <div>
                                <p className="text-gray-500 font-bold">
                                    в списке желаний
                                </p>
                                <p className="text-gray-500 font-bold">
                                    <span className="text-white text-2xl">
                                        {stats.totalWishlist}
                                    </span>{" "}
                                    проектов
                                </p>
                            </div>
                        </div>

                        <div className="bg-form-color shadow-[4px_4px_10px_0px_rgba(15,15,15,15)] rounded-3xl p-8 h-55 relative flex flex-col gap-4">
                            <p className="absolute top-3 right-5 text-gray-500 font-bold">
                                Избранное
                            </p>
                            <div className="bg-red-400/20 text-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Heart />
                            </div>
                            <div>
                                <p className="text-gray-500 font-bold">
                                    любимый жанр
                                </p>
                                <span className="text-white text-2xl">
                                    {stats.topGenreData.genreName}
                                </span>
                                <p className="text-gray-500 font-bold">
                                    {`${stats.topGenreData.percentage}% вашей коллекции`}
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col gap-12 bg-form-color shadow-[4px_4px_10px_0px_rgba(15,15,15,15)] rounded-3xl w-full h-90 p-10">
                        <div className="flex items-center justify-between">
                            <p className="text-white text-lg">
                                Распределение жанров
                            </p>
                            <ChartPie className="text-gray-500" />
                        </div>
                        <GenrePieChart items={stats.watched} />
                    </div>

                    <div className="flex flex-col">
                        {stats.recent.length === 0 ? (
                            <p className="text-gray-500 text-lg px-6">
                                Вы еще ничего не смотрели.
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
