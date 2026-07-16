"use client";

import { AnimatePresence, motion } from "framer-motion";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import { detailsRouter } from "@/helpers/detailsRouter";
import Loader from "@/components/Loader";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";

export default function Collection() {
    const { isLoadingUser } = useAuthStore();

    const collectionArr = useCollectionStore((state) => state.collectionArr);
    const isLoadingCollection = useCollectionStore(
        (state) => state.isLoadingCollection,
    );
    const criticalError = useCollectionStore((state) => state.criticalError);

    if (criticalError) throw criticalError;

    const router = useRouter();

    const viewKey =
        isLoadingUser || isLoadingCollection
            ? "loading"
            : collectionArr.length === 0
              ? "empty"
              : "filled";
    return (
        <div className="flex-1 min-w-0 flex flex-col">
            <AnimatePresence mode="wait">
                {viewKey === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center"
                    >
                        <Loader size="large">Загрузка коллекции...</Loader>
                    </motion.div>
                )}
                {viewKey === "empty" && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center"
                    >
                        <p className="text-gray-500 text-3xl px-6">
                            Ваша коллекця пуста.
                        </p>
                    </motion.div>
                )}
                {viewKey === "filled" && (
                    <motion.div
                        key="filled"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col"
                    >
                        <p className="text-gray-500 text-3xl px-6">
                            Ваша коллекция.
                        </p>

                        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-6 justify-items-center">
                            <AnimatePresence mode="popLayout">
                                {collectionArr.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout="position"
                                        className="w-full"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 40,
                                            opacity: { duration: 0.2 },
                                        }}
                                    >
                                        <Card
                                            item={item}
                                            onClick={() =>
                                                detailsRouter(
                                                    router,
                                                    item.id,
                                                    item.type,
                                                )
                                            }
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
