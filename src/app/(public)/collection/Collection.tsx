"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from "@/context/AuthContext";
import Card from "@/components/Card";
import { useCollectionContext } from "@/context/CollectionContext";
import { useRouter } from "next/navigation";
import detailsRouter from "@/helpers/detailsRouter";

export default function Collection() {
    const { isLoading } = useAuthContext();
    const { collectionArr, isLoadingCollection } = useCollectionContext();

    const router = useRouter();

    const viewKey =
        isLoading || isLoadingCollection
            ? "loading"
            : collectionArr.length === 0
              ? "empty"
              : "filled";
    return (
        <div className="flex-1 min-w-0 flex flex-col">
            {(isLoading || isLoadingCollection) && <p>Loading...</p>}
            {collectionArr.length === 0 &&
                !isLoadingCollection &&
                !isLoading && (
                    <p className="text-gray-500 text-3xl px-6">
                        Ваша коллекця пуста.
                    </p>
                )}
            {collectionArr.length !== 0 && !isLoadingCollection && (
                <p className="text-gray-500 text-3xl px-6">Ваша коллекция.</p>
            )}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-6 justify-items-center"
                >
                    {collectionArr.map((item) => (
                        <Card
                            key={item.id}
                            item={item}
                            genres={item.genres}
                            onClick={() =>
                                detailsRouter(router, item.id, item.type)
                            }
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
