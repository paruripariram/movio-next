"use client";

import type { collectionItem, SearchResult } from "@/types";
import { Bookmark, Check } from "lucide-react";
import Image from "next/image";
import { PLATFORMS } from "@/config/platforms";
import { useCollectionStore } from "@/store/collectionStore";
import { useGenresStore } from "@/store/genreStore";
import CollectionButton from "./CollectionButton";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

interface CardProps {
    item: SearchResult | collectionItem;
    onClick?: () => void;
    className?: string;
}

export default function Card({ item, onClick, className = "" }: CardProps) {
    const { user } = useAuthStore();
    const collectionArr = useCollectionStore((state) => state.collectionArr);
    const genresMap = useGenresStore((state) => state.genresMap);
    const mediaType =
        "type" in item ? item.type : "title" in item ? "movie" : "tv";
    const statusInCollection = collectionArr.find(
        (collectionItem) =>
            collectionItem.id === item.id && collectionItem.type === mediaType,
    )?.status;
    const platformInCollection = collectionArr.find(
        (collectionItem) =>
            collectionItem.id === item.id && collectionItem.type === mediaType,
    )?.platform;

    const title = ("title" in item ? item.title : item.name) || "Untitled";
    const posterUrl = item.poster_path;
    const imageSrc = posterUrl
        ? `https://image.tmdb.org/t/p/w500${posterUrl}`
        : "/noPoster.webp";
    const voteAverage = item.vote_average;

    const resolvedGenres = item.genre_ids
        .map((id) => genresMap.movieGenres[id] || genresMap.tvGenres[id])
        .filter((name): name is string => Boolean(name));

    const rawDate =
        ("release_date" in item && item.release_date) ||
        ("first_air_date" in item && item.first_air_date) ||
        "";

    const year = rawDate ? rawDate.substring(0, 4) : "N/A";

    const fadeScaleVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    return (
        <div
            onClick={onClick}
            className={`group/card relative flex max-w-92.5 w-full aspect-2/3 overflow-hidden rounded-2xl sm:rounded-4xl cursor-pointer hover:scale-105 hover:shadow-glow-bold transition-all duration-300 ease-in-out ${className}`}
        >
            <Image
                src={imageSrc}
                alt={title}
                fill
                unoptimized
                className="absolute top-0 left-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/noPoster.webp")}
            />

            {/* Бэйдж рейтинга */}
            <span className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 px-2 py-0.5 sm:w-15 sm:h-10 rounded-xl sm:rounded-4xl sm:p-2 flex items-center justify-center font-bold text-xs sm:text-base text-primary bg-back-link-color/80 backdrop-blur-xs z-10">
                {voteAverage !== null && voteAverage?.toFixed(1)}
            </span>

            <div className="z-10 flex flex-col mt-auto w-full p-2.5 sm:p-5 bg-linear-to-t from-back-link-color via-back-link-color/80 to-transparent">
                <AnimatePresence mode="popLayout">
                    {statusInCollection === "watched" && (
                        <motion.div
                            key="watched-container"
                            variants={fadeScaleVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 flex flex-col gap-1 sm:gap-1.5"
                        >
                            <span className="h-7 sm:h-10 px-2 sm:w-20 rounded-xl sm:rounded-4xl flex gap-1 sm:gap-1.5 items-center justify-center font-bold text-primary bg-back-link-color/80 backdrop-blur-xs">
                                <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                <Image
                                    src={
                                        PLATFORMS.find(
                                            (p) =>
                                                p.id === platformInCollection,
                                        )?.logoUrl ||
                                        PLATFORMS.find((p) => p.id === "other")
                                            ?.logoUrl ||
                                        ""
                                    }
                                    alt={
                                        PLATFORMS.find(
                                            (p) =>
                                                p.id === platformInCollection,
                                        )?.name || "source"
                                    }
                                    width={32}
                                    height={32}
                                    className="w-4 h-4 sm:w-8 sm:h-8 rounded-sm sm:rounded-md object-contain"
                                />
                            </span>
                            <span className="opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto">
                                <CollectionButton
                                    type="remove"
                                    variant="icon"
                                    item={item}
                                    mediaType={mediaType}
                                />
                            </span>
                        </motion.div>
                    )}

                    {statusInCollection === "wishlist" && (
                        <motion.div
                            key="wishlist-container"
                            variants={fadeScaleVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 flex flex-col gap-1 sm:gap-1.5"
                        >
                            <span className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-4xl p-1 sm:p-2 flex items-center justify-center font-bold text-primary bg-back-link-color/80 backdrop-blur-xs">
                                <Bookmark className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            </span>
                            <span className="opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto">
                                <CollectionButton
                                    type="watched"
                                    variant="icon"
                                    item={item}
                                    mediaType={mediaType}
                                />
                            </span>
                            <span className="opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto">
                                <CollectionButton
                                    type="remove"
                                    variant="icon"
                                    item={item}
                                    mediaType={mediaType}
                                />
                            </span>
                        </motion.div>
                    )}

                    {user && statusInCollection === undefined && (
                        <motion.div
                            key="empty-container"
                            variants={fadeScaleVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 flex flex-col gap-1 sm:gap-1.5"
                        >
                            <span className="opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto">
                                <CollectionButton
                                    type="wishlist"
                                    variant="icon"
                                    item={item}
                                    mediaType={mediaType}
                                />
                            </span>
                            <span className="opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto">
                                <CollectionButton
                                    type="watched"
                                    variant="icon"
                                    item={item}
                                    mediaType={mediaType}
                                />
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <h3 className="text-xs sm:text-xl font-bold sm:font-extrabold text-white line-clamp-2 leading-tight mb-0.5 sm:mb-1">
                    {title}
                </h3>
                <div>
                    <p className="text-[10px] sm:text-sm text-zinc-300 sm:text-white truncate">
                        <span>{year}</span>
                        {resolvedGenres[0] ? `, ${resolvedGenres[0]}` : ""}
                    </p>
                </div>
            </div>
        </div>
    );
}
