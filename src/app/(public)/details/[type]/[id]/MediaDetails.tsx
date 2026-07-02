"use client";

import BackButton from "@/components/BackButton";
import CollectionButton from "@/components/CollectionButton";
import { useAuthContext } from "@/context/AuthContext";
import { APP_ROUTES } from "@/config/routes";
import useCollectionActions from "@/hooks/useCollectionActions";
import type { MovieDetails, TVDetails } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MediaDetailsProps = {
    details: MovieDetails | TVDetails;
    type: "movie" | "tv";
};

export default function MediaDetails({ details, type }: MediaDetailsProps) {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();

    const {
        status,
        isPending,
        handleAddToCollection,
        handleRemoveFromCollection,
    } = useCollectionActions(type, details, user);

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push(APP_ROUTES.HOME.path);
        }
    };

    return (
        <div>
            <div className="relative -mx-13 -mt-13 overflow-hidden">
                <div className="absolute z-10 top-5 left-5" onClick={handleBack}>
                    <BackButton />
                </div>

                <div className="relative -mx-13 -mt-13 overflow-hidden h-[60vh]">
                    <Image
                        src={`https://image.tmdb.org/t/p/w1920/${details.backdrop_path}`}
                        alt=""
                        fill
                        unoptimized
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                </div>

                <div className="z-10 flex flex-col absolute bottom-0 h-1/2 w-full bg-linear-to-t from-bgcolor to-transparent via-bgcolor/90 px-13 pt-30">
                    <div className="flex justify-between gap-5">
                        <h1 className="text-4xl font-bold text-white self-start">
                            {"title" in details ? details.title : details.name}
                        </h1>

                        <div className="flex gap-5">
                            <div className="flex flex-col">
                                <span className="text-primary font-extrabold text-4xl">
                                    {details.vote_average}
                                </span>
                                <span className="text-gray-500">
                                    {details.vote_count} оценки
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={status ? status : "empty"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col gap-5"
                                >
                                    {isLoading && <p>Loading...</p>}

                                    {!user && !isLoading && (
                                        <CollectionButton
                                            type="notAnAccount"
                                            onClick={() => router.push(APP_ROUTES.SIGNIN.path)}
                                        />
                                    )}

                                    {user && status === null && (
                                        <>
                                            <CollectionButton
                                                type="watched"
                                                onClick={() => handleAddToCollection("watched")}
                                                disabled={isPending}
                                            />
                                            <CollectionButton
                                                type="wishlist"
                                                onClick={() => handleAddToCollection("wishlist")}
                                                disabled={isPending}
                                            />
                                        </>
                                    )}

                                    {user && status === "watched" && (
                                        <CollectionButton
                                            type="remove"
                                            onClick={handleRemoveFromCollection}
                                            disabled={isPending}
                                        />
                                    )}

                                    {user && status === "wishlist" && (
                                        <>
                                            <CollectionButton
                                                type="watched"
                                                onClick={() => handleAddToCollection("watched")}
                                                disabled={isPending}
                                            />
                                            <CollectionButton
                                                type="remove"
                                                onClick={handleRemoveFromCollection}
                                                disabled={isPending}
                                            />
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="z-11 absolute flex flex-col gap-5">
                <div>
                    {details.genres.map((genre) => (
                        <span key={genre.id} className="text-primary font-bold">
                            {genre.name.charAt(0).toUpperCase() +
                                genre.name.slice(1).toLowerCase()}{" "}
                        </span>
                    ))}
                </div>

                <p className="text-white">{details.overview}</p>
            </div>
        </div>
    );
}