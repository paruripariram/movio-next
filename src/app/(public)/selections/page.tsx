import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FEATURED_SELECTIONS } from "@/config/selectionsConfig";
import { APP_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
    title: APP_ROUTES.SELECTIONS.title,
};

export default function SelectionsPage() {
    return (
        <div className="flex flex-col min-h-screen w-full min-w-0 py-6 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Каталог подборок
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-2xl">
                Кураторские коллекции фильмов и сериалов под любое настроение.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                {FEATURED_SELECTIONS.map((selection) => (
                    <Link
                        key={selection.id}
                        href={`/selections/${selection.slug || selection.id}`}
                        className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-back-link-color min-h-50 sm:min-h-62.5 transition-transform duration-300 hover:scale-[1.02]"
                    >
                        {selection.backdropUrl && (
                            <Image
                                src={selection.backdropUrl}
                                alt={selection.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        )}

                        <div className="absolute inset-0 z-10 bg-linear-to-t from-bgcolor via-bgcolor/80 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />

                        <div className="relative z-20 p-5 sm:p-6 flex flex-col gap-1.5">
                            <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                {selection.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                                {selection.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}