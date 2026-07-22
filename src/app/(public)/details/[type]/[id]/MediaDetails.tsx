"use client";

import BackButton from "@/components/BackButton";
import CollectionButton from "@/components/CollectionButton";
import Loader from "@/components/Loader";
import { PLATFORMS } from "@/config/platforms";
import { APP_ROUTES } from "@/config/routes";
import useCollectionActions from "@/hooks/useCollectionActions";
import { useAuthStore } from "@/store/authStore";
import type { MovieDetails, TVDetails } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MediaDetailsProps = {
    details: MovieDetails | TVDetails;
    type: "movie" | "tv";
};

export default function MediaDetails({ details, type }: MediaDetailsProps) {
    const { user, isLoadingUser } = useAuthStore();
    const router = useRouter();
    const { status, platform } = useCollectionActions(type, details, user);

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push(APP_ROUTES.HOME.path);
        }
    };

    const backdropPath = details.backdrop_path
        ? `https://image.tmdb.org/t/p/w1920/${details.backdrop_path}`
        : "/noPoster.webp";

    const releaseDate =
        "release_date" in details
            ? details.release_date
            : details.first_air_date;

    const releaseYear =
        releaseDate && !isNaN(Date.parse(releaseDate))
            ? new Date(releaseDate).getFullYear()
            : null;

    const formatRuntime = (minutes: number | null) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
    };

    const getCountryName = new Intl.DisplayNames(["ru"], { type: "region" });
    const formatCountry = (code: string) => {
        try {
            return getCountryName.of(code);
        } catch {
            return code;
        }
    };

    const currentPlatform =
        PLATFORMS.find((p) => p.id === platform) ??
        PLATFORMS.find((p) => p.id === "other");

    const actionStateKey = isLoadingUser
        ? "loading"
        : !user
          ? "guest"
          : (status ?? "none");

    return (
        <div className="flex flex-col min-h-screen w-full min-w-0">
            <div className="relative -mt-4 -mx-4 sm:-mt-6 sm:-mx-6 md:-mt-8 md:-mx-8 lg:-mt-10 lg:-mx-10 xl:-mt-12 xl:-mx-12 2xl:-mt-16 2xl:-mx-16 overflow-hidden h-90 sm:h-105 lg:h-120 shrink-0 bg-back-link-color">
                <div
                    className="absolute z-30 top-4 left-4 sm:top-6 sm:left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-16 cursor-pointer"
                    onClick={handleBack}
                >
                    <BackButton />
                </div>

                <Image
                    src={backdropPath}
                    alt={"title" in details ? details.title : details.name}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top"
                />

                <div className="absolute inset-0 z-10 bg-linear-to-t from-bgcolor via-bgcolor/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pb-4 sm:pb-6 lg:pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                    <div className="flex flex-col gap-1.5 max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                            {"title" in details ? details.title : details.name}
                            {releaseYear && (
                                <span className="text-gray-300 font-normal text-xl sm:text-2xl lg:text-3xl ml-2 sm:ml-3">
                                    ({releaseYear})
                                </span>
                            )}
                        </h1>

                        {details.tagline && (
                            <p className="text-gray-300 italic text-sm sm:text-base line-clamp-2">
                                «{details.tagline.replace(/^«|»$/g, "")}»
                            </p>
                        )}

                        {details.production_countries &&
                            details.production_countries.length > 0 && (
                                <div className="flex gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                                    <span>Страна:</span>
                                    <span className="text-gray-200">
                                        {details.production_countries
                                            .map((country) =>
                                                formatCountry(
                                                    country.iso_3166_1,
                                                ),
                                            )
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                </div>
                            )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center lg:items-end gap-4 sm:gap-6 w-full lg:w-auto shrink-0">
                        <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
                            <span className="text-primary font-extrabold text-3xl sm:text-4xl leading-none">
                                {details.vote_average
                                    ? details.vote_average.toFixed(1)
                                    : "0.0"}
                            </span>
                            <span className="text-gray-400 text-xs sm:text-sm">
                                {details.vote_count ?? 0} оценки
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={actionStateKey}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full sm:w-auto"
                            >
                                {isLoadingUser && (
                                    <Loader size="small">Загрузка...</Loader>
                                )}

                                {!isLoadingUser && !user && (
                                    <CollectionButton
                                        variant="full"
                                        type="notAnAccount"
                                        item={details}
                                        mediaType={type}
                                    />
                                )}

                                {!isLoadingUser && user && status === null && (
                                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                                        <CollectionButton
                                            variant="full"
                                            type="watched"
                                            item={details}
                                            mediaType={type}
                                        />
                                        <CollectionButton
                                            variant="full"
                                            type="wishlist"
                                            item={details}
                                            mediaType={type}
                                        />
                                    </div>
                                )}

                                {!isLoadingUser &&
                                    user &&
                                    status === "watched" && (
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                                            <div className="px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex gap-2.5 items-center justify-center font-bold text-xs sm:text-sm text-primary bg-back-link-color/90 border border-white/5 shrink-0">
                                                <span>Просмотрено</span>
                                                {currentPlatform?.logoUrl && (
                                                    <Image
                                                        src={
                                                            currentPlatform.logoUrl
                                                        }
                                                        alt={
                                                            currentPlatform.name ||
                                                            "source"
                                                        }
                                                        width={28}
                                                        height={28}
                                                        className="w-5 h-5 sm:w-7 sm:h-7 object-contain shrink-0"
                                                    />
                                                )}
                                            </div>
                                            <CollectionButton
                                                variant="full"
                                                type="remove"
                                                item={details}
                                                mediaType={type}
                                            />
                                        </div>
                                    )}

                                {!isLoadingUser &&
                                    user &&
                                    status === "wishlist" && (
                                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                                            <CollectionButton
                                                variant="full"
                                                type="watched"
                                                item={details}
                                                mediaType={type}
                                            />
                                            <CollectionButton
                                                variant="full"
                                                type="remove"
                                                item={details}
                                                mediaType={type}
                                            />
                                        </div>
                                    )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 pt-6 pb-12 w-full min-w-0">
                {details.genres && details.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {details.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-xs sm:text-sm"
                            >
                                {genre.name.charAt(0).toUpperCase() +
                                    genre.name.slice(1).toLowerCase()}
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-back-link-color p-3 sm:p-4 rounded-xl text-sm sm:text-md text-gray-300">
                    <div>
                        <span className="text-gray-500 block text-xs sm:text-sm">
                            Статус
                        </span>
                        {details.status === "Released"
                            ? "Вышел"
                            : "В производстве"}
                    </div>

                    {"runtime" in details ? (
                        <div>
                            <span className="text-gray-500 block text-xs sm:text-sm">
                                Длительность
                            </span>
                            {formatRuntime(details.runtime) || "Не указано"}
                        </div>
                    ) : (
                        <div>
                            <span className="text-gray-500 block text-xs sm:text-sm">
                                Сезоны / Серии
                            </span>
                            {details.number_of_seasons ?? 0} сез. /{" "}
                            {details.number_of_episodes ?? 0} сер.
                        </div>
                    )}

                    {"budget" in details && details.budget > 0 && (
                        <div>
                            <span className="text-gray-500 block text-xs sm:text-sm">
                                Бюджет
                            </span>
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            }).format(details.budget)}
                        </div>
                    )}
                </div>

                {details.overview && (
                    <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-4xl">
                        {details.overview}
                    </p>
                )}

                {details.credits?.cast && details.credits.cast.length > 0 && (
                    <div className="flex flex-col gap-3 sm:gap-4 mt-2 w-full min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                            В главных ролях
                        </h3>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 w-full min-w-0 scrollbar-thin scrollbar-thumb-white/10">
                            {details.credits.cast.slice(0, 10).map((actor) => (
                                <div
                                    key={actor.id}
                                    className="shrink-0 w-28 sm:w-36 lg:w-40 text-center flex flex-col items-center gap-1.5 sm:gap-2"
                                >
                                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-white/10">
                                        <Image
                                            src={
                                                actor.profile_path
                                                    ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                                                    : "/noPoster.webp"
                                            }
                                            alt={actor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-xs sm:text-sm lg:text-md font-semibold text-white line-clamp-2 leading-tight">
                                        {actor.name}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-400 line-clamp-1">
                                        {actor.character}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}