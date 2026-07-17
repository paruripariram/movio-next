"use client";

import BackButton from "@/components/BackButton";
import CollectionButton from "@/components/CollectionButton";
import { APP_ROUTES } from "@/config/routes";
import type { MovieDetails, TVDetails } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/Loader";
import useCollectionActions from "@/hooks/useCollectionActions";
import { PLATFORMS } from "@/config/platforms";

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
    const releaseYear = releaseDate
        ? new Date(releaseDate).getFullYear()
        : null;

    const formatRuntime = (minutes: number | null) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
    };
    const getCountryName = new Intl.DisplayNames(["ru"], { type: "region" });

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative -mx-13 -mt-13 overflow-hidden h-[60vh] shrink-0">
                <div
                    className="absolute z-20 top-5 left-5 cursor-pointer"
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

                <div className="absolute inset-0 z-10 bg-linear-to-t from-bgcolor via-bgcolor/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 z-20 px-13 pb-6 flex justify-between items-end gap-5">
                    <div className="flex flex-col gap-2 max-w-[70%]">
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            {"title" in details ? details.title : details.name}
                            {releaseYear && (
                                <span className="text-gray-400 font-normal text-3xl ml-3">
                                    ({releaseYear})
                                </span>
                            )}
                        </h1>
                        {details.tagline && (
                            <p className="text-gray-300 italic text-lg line-clamp-2">
                                {details.tagline}
                            </p>
                        )}
                        <div className="flex gap-2 text-sm text-gray-500">
                            <span className="text-sm text-gray-400">
                                Страна:
                            </span>
                            {details.production_countries
                                .map((country) => {
                                    return getCountryName.of(
                                        country.iso_3166_1,
                                    );
                                })
                                .join(", ")}
                        </div>
                    </div>

                    <div className="flex gap-5 shrink-0 items-center">
                        <div className="flex flex-col text-right">
                            <span className="text-primary font-extrabold text-4xl">
                                {details.vote_average?.toFixed(1)}
                            </span>
                            <span className="text-gray-400 text-sm">
                                {details.vote_count} оценки
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={status ? status : "empty"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex gap-3"
                            >
                                {isLoadingUser && (
                                    <Loader size="small">Loading...</Loader>
                                )}

                                {!user && !isLoadingUser && (
                                    <CollectionButton
                                        variant="full"
                                        type="notAnAccount"
                                        item={details}
                                        mediaType={type}
                                    />
                                )}

                                {user && status === null && (
                                    <>
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
                                    </>
                                )}

                                {user && status === "watched" && (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-50 h-18 rounded-4xl p-2 flex gap-3 items-center justify-center font-bold text-primary bg-back-link-color/80">
                                        <p>Просмотрено</p>
                                            <Image
                                                src={
                                                    PLATFORMS.find(
                                                        (p) =>
                                                            p.id === platform,
                                                    )?.logoUrl ||
                                                    PLATFORMS.find(
                                                        (p) => p.id === "other",
                                                    )?.logoUrl ||
                                                    ""
                                                }
                                                alt={
                                                    PLATFORMS.find(
                                                        (p) =>
                                                            p.id === platform,
                                                    )?.name || "source"
                                                }
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <CollectionButton
                                            variant="full"
                                            type="remove"
                                            item={details}
                                            mediaType={type}
                                        />
                                    </div>
                                )}

                                {user && status === "wishlist" && (
                                    <>
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
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8 mt-8 pb-12">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        {details.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm"
                            >
                                {genre.name.charAt(0).toUpperCase() +
                                    genre.name.slice(1).toLowerCase()}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-back-link-color p-4 rounded-xl text-md text-gray-300 my-2">
                        <div>
                            <span className="text-gray-500 block">Статус</span>
                            {details.status === "Released"
                                ? "Вышел"
                                : "В производстве"}
                        </div>
                        {"runtime" in details ? (
                            <div>
                                <span className="text-gray-500 block">
                                    Длительность
                                </span>
                                {formatRuntime(details.runtime)}
                            </div>
                        ) : (
                            <div>
                                <span className="text-gray-500 block">
                                    Сезоны / Серии
                                </span>
                                {details.number_of_seasons} сез. /{" "}
                                {details.number_of_episodes} сер.
                            </div>
                        )}
                        {"budget" in details && details.budget > 0 && (
                            <div>
                                <span className="text-gray-500 block">
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

                    <p className="text-gray-200 text-lg leading-relaxed max-w-4xl">
                        {details.overview}
                    </p>
                </div>

                {details.credits?.cast?.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-2xl font-bold text-white">
                            В главных ролях
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
                            {details.credits.cast.slice(0, 10).map((actor) => (
                                <div
                                    key={actor.id}
                                    className="shrink-0 w-40 text-center flex flex-col items-center gap-2"
                                >
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden bg-white/10">
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
                                    <span className="text-md font-semibold text-white line-clamp-2 leading-tight">
                                        {actor.name}
                                    </span>
                                    <span className="text-sm text-gray-400 line-clamp-1">
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
