"use client";

import { AnimatePresence, motion } from "framer-motion";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import {detailsRouter} from "@/helpers/detailsRouter";
import Loader from "@/components/Loader";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";

export default function Collection() {
    const { isLoadingUser } = useAuthStore();

    const collectionArr = useCollectionStore((state) => state.collectionArr);
    const isLoadingCollection = useCollectionStore((state) => state.isLoadingCollection);
    const criticalError = useCollectionStore((state) => state.criticalError);

    if(criticalError) throw criticalError

    const router = useRouter();

    const viewKey =
        isLoadingUser || isLoadingCollection
            ? "loading"
            : collectionArr.length === 0
              ? "empty"
              : "filled";
    return (
        <div className="flex-1 min-w-0 flex flex-col">
            {(isLoadingUser || isLoadingCollection) && (
                <Loader size="large">Загрузка коллекции...</Loader>
            )}
            {collectionArr.length === 0 &&
                !isLoadingCollection &&
                !isLoadingUser && (
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
