"use client";

import type { collectionItem, SearchResult } from "@/types";
import { Bookmark, Check } from "lucide-react";
import Image from "next/image";
import { PLATFORMS } from "@/config/platforms";
import { useCollectionStore } from "@/store/collectionStore";
import { useGenresStore } from "@/store/genreStore";
import CollectionButton from "./CollectionButton";
import { AnimatePresence, motion } from "framer-motion";

interface CardProps {
    item: SearchResult | collectionItem;
    onClick?: () => void;
    className?: string;
}

export default function Card({ item, onClick, className = "" }: CardProps) {
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
            className={`group/card relative flex max-w-92.5 w-full aspect-2/3 overflow-hidden rounded-4xl cursor-pointer hover:scale-105 hover:shadow-glow-bold transition-all duration-300 ease-in-out ${className}`}
        >
            <Image
                src={imageSrc}
                alt={title}
                fill
                unoptimized
                className="absolute top-0 left-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/noPoster.webp")}
            />
            <div className="z-10 flex flex-col mt-auto w-full p-5 bg-linear-to-t from-back-link-color to-transparent via-back-link-color/80">
                <span className="absolute top-5 right-5 w-15 h-10 rounded-4xl p-2 text-center font-bold text-primary bg-back-link-color/80">
                    {voteAverage !== null && voteAverage?.toFixed(1)}
                </span>
                <AnimatePresence mode="popLayout">
                {statusInCollection === "watched" && (
                    <motion.div 
                    key="watched-container"
                    variants={fadeScaleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{duration:0.3, ease:"easeOut"}}
                    className="absolute top-5 left-5 flex flex-col gap-1.5">
                        <span className="w-20 h-10 rounded-4xl p-2 flex gap-1.5 items-center justify-center font-bold text-primary bg-back-link-color/80">
                            <Check />
                            <Image
                                src={
                                    PLATFORMS.find(
                                        (p) => p.id === platformInCollection,
                                    )?.logoUrl ||
                                    PLATFORMS.find((p) => p.id === "other")
                                        ?.logoUrl ||
                                    ""
                                }
                                alt={
                                    PLATFORMS.find(
                                        (p) => p.id === platformInCollection,
                                    )?.name || "source"
                                }
                                width={32}
                                height={32}
                            />
                        </span>
                        <span
                            className="opacity-0 scale-90 pointer-events-none
                  transition-all duration-300 ease-out
                  group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto"
                        >
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
                    transition={{duration:0.3, ease:"easeOut"}}
                    className="absolute top-5 left-5 flex flex-col gap-1.5">
                        <span className="w-10 h-10 rounded-4xl p-2 flex items-center justify-center font-bold text-primary bg-back-link-color/80">
                            <Bookmark />
                        </span>
                        <span
                            className="opacity-0 scale-90 pointer-events-none
                  transition-all duration-300 ease-out
                  group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto"
                        >
                            <CollectionButton
                                type="watched"
                                variant="icon"
                                item={item}
                                mediaType={mediaType}
                            />
                        </span>
                        <span
                            className="opacity-0 scale-90 pointer-events-none
                  transition-all duration-300 ease-out
                  group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto"
                        >
                            <CollectionButton
                                type="remove"
                                variant="icon"
                                item={item}
                                mediaType={mediaType}
                            />
                        </span>
                    </motion.div>
                )}
                {statusInCollection === undefined && (
                    <motion.div 
                    key="empty-container"
                    variants={fadeScaleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{duration:0.3, ease:"easeOut"}}
                    className="absolute top-5 left-5 flex flex-col gap-1.5">
                        <span
                            className="opacity-0 scale-90 pointer-events-none
                  transition-all duration-300 ease-out
                  group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto"
                        >
                            <CollectionButton
                                type="wishlist"
                                variant="icon"
                                item={item}
                                mediaType={mediaType}
                            />
                        </span>
                        <span
                            className="opacity-0 scale-90 pointer-events-none
                  transition-all duration-300 ease-out
                  group-hover/card:opacity-100 group-hover/card:scale-100 group-hover/card:pointer-events-auto"
                        >
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

                <h3 className="text-xl font-extrabold text-white ">{title}</h3>
                <div>
                    <p className="text-white">
                        <span>{year}</span>, <span>{resolvedGenres[0]}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
