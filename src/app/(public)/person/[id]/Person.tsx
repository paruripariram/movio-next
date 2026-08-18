"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Card from "@/components/media/Card";
import SearchInput from "@/components/ui/SearchInput";
import Toggler from "@/components/filteres/Toggler";
import { detailsRouter } from "@/helpers/detailsRouter";
import { PersonProps } from "@/types/tmdb";

export default function Person({ person, credits }: PersonProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");

    const togglerOptions = [
        { value: "all", label: "Все" },
        { value: "movie", label: "Фильмы" },
        { value: "tv", label: "Сериалы" },
    ];

    const filteredCredits = useMemo(() => {
        const filtered = credits.filter((item) => {
            const matchesType =
                filterType === "all" ? true : item.media_type === filterType;

            const itemTitle =
                item.media_type === "movie" ? item.title : item.name;

            const matchesSearch =
                !searchQuery ||
                (itemTitle &&
                    itemTitle
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            return matchesType && matchesSearch;
        });

        const uniqueCredits = [];
        const seenIds = new Set();

        for (const item of filtered) {
            const uniqueId = `${item.media_type}-${item.id}`;
            if (!seenIds.has(uniqueId)) {
                seenIds.add(uniqueId);
                uniqueCredits.push(item);
            }
        }

        return uniqueCredits;
    }, [credits, filterType, searchQuery]);

    const profileImageUrl = person?.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        :  "/noPoster.webp";

    return (
        <div className="flex flex-col gap-6 md:gap-10 w-full max-w-full">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start bg-form-color/40 p-6 rounded-2xl border border-white/5 shadow-md">
                <div className="relative w-40 h-56 sm:w-48 sm:h-72 shrink-0 rounded-xl overflow-hidden bg-zinc-800 shadow-lg">

                        <Image
                            src={profileImageUrl}
                            alt={person?.name || "Актер"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 160px, 192px"
                            priority
                        />
                  
                </div>

                <div className="flex flex-col gap-3 text-center md:text-left flex-1">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white">
                        {person?.name}
                    </h1>

                    {person?.known_for_department && (
                        <span className="text-primary font-medium text-sm sm:text-base">
                            {person.known_for_department === "Acting"
                                ? "Актер / Актриса"
                                : person.known_for_department}
                        </span>
                    )}

                    {person?.biography && (
                        <p className="text-zinc-400 text-sm sm:text-base line-clamp-6 leading-relaxed mt-1">
                            {person.biography}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 px-2 sm:px-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <h2 className="text-xl sm:text-3xl font-bold text-white shrink-0">
                        Проекты ({filteredCredits.length})
                    </h2>

                    <div className="w-full md:w-87.5 shrink-0">
                        <Toggler
                            options={togglerOptions}
                            value={filterType}
                            optionHandler={(val) => setFilterType(val as "all" | "movie" | "tv")}
                            className="bg-form-color/60 border border-white/5"
                        />
                    </div>
                </div>

                <div className="w-full mt-2">
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-6 p-2 sm:p-6 justify-items-center">
                {filteredCredits.length === 0 ? (
                    <p className="text-gray-500 text-xl sm:text-2xl col-span-full py-10 text-center">
                        Проекты не найдены
                    </p>
                ) : (
                    filteredCredits.map((item) => (
                        <motion.div
                            key={`${item.media_type}-${item.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                ease: "easeOut",
                            }}
                            className="w-full min-w-0 flex justify-center"
                        >
                            <Card
                                item={item}
                                onClick={() => {
                                    detailsRouter(
                                        router,
                                        item.id,
                                        item.media_type
                                    );
                                }}
                            />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}