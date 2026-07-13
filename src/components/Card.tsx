"use client";

import type { collectionItem, SearchResult } from "@/types";
import { Bookmark, Check } from "lucide-react";
import Image from "next/image";
import { PLATFORMS } from "@/config/platforms";
import { useCollectionStore } from "@/store/collectionStore";

interface CardProps {
    item: SearchResult | collectionItem;
    genres: string[];
    onClick?: () => void;
    className?: string;
}

export default function Card({
    item,
    genres,
    onClick,
    className = "",
}: CardProps) {
    const collectionArr = useCollectionStore((state) => state.collectionArr);
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
        : "/noPoster.png";
    const voteAverage = item.vote_average;
    return (
        <div
            onClick={onClick}
            className={`relative flex max-w-92.5 w-full aspect-2/3 overflow-hidden rounded-4xl cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${className}`}
        >
            <Image
                src={imageSrc}
                alt={title}
                fill
                unoptimized
                className="absolute top-0 left-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/noPoster.png")}
            />
            <div className="z-10 flex flex-col mt-auto w-full p-5 bg-linear-to-t from-back-link-color to-transparent via-back-link-color/80">
                <span className="absolute top-5 right-5 w-15 h-10 rounded-4xl p-2 text-center font-bold text-primary bg-back-link-color/80">
                    {voteAverage !== null && voteAverage?.toFixed(1)}
                </span>
                {statusInCollection === "watched" && (
                    <span className="absolute top-5 left-5 w-20 h-10 rounded-4xl p-2 flex gap-1.5 items-center justify-center font-bold text-primary bg-back-link-color/80">
                        <Check />
                        <Image
                            src={
                                PLATFORMS.find((p) => p.id === platformInCollection)
                                    ?.logoUrl || 
                                    PLATFORMS.find((p) => p.id === "other")?.logoUrl || ""
                            }
                            alt={
                                PLATFORMS.find((p) => p.id === platformInCollection)
                                    ?.name || 'source'
                            }
                            width={32}
                            height={32}
                        />
                    </span>
                )}
                {statusInCollection === "wishlist" && (
                    <span className="absolute top-5 left-5 w-10 h-10 rounded-4xl p-2 flex items-center justify-center font-bold text-primary bg-back-link-color/80">
                        <Bookmark />
                    </span>
                )}

                <h3 className="text-xl font-extrabold text-white ">{title}</h3>
                <div>
                    {genres.map((genre) => (
                        <span key={genre} className="text-white">
                            {genre.charAt(0).toUpperCase() +
                                genre.slice(1).toLowerCase()}{" "}
                        </span>
                    ))}
                </div>
                {/* <p className="text-sm text-white">{overview}</p> */}
            </div>
        </div>
    );
}
