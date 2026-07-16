"use client";

import useCollectionActions from "@/hooks/useCollectionActions";
import { useAuthStore } from "@/store/authStore";
import { useWatchedModalStore } from "@/store/watchedModalStore";
import {
    collectionItem,
    MovieDetails,
    SearchResult,
    TVDetails,
    User,
} from "@/types";
import WatchedModal from "../WatchedModal";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ModalProvider() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { isOpen, item, mediaType, closeModal } = useWatchedModalStore();
    useEffect(() => {
        if (isOpen) {
            closeModal();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, closeModal]);

    return (
        <AnimatePresence>
            {isOpen && item && mediaType && user && (
                <ActiveWatchedModal
                    item={item}
                    mediaType={mediaType}
                    user={user}
                    onClose={closeModal}
                />
            )}
        </AnimatePresence>
    );
}

interface ActiveWatchedModalProps {
    item: collectionItem | MovieDetails | TVDetails | SearchResult;
    mediaType: "movie" | "tv";
    user: User;
    onClose: () => void;
}

function ActiveWatchedModal({
    item,
    mediaType,
    user,
    onClose,
}: ActiveWatchedModalProps) {
    const { handleAddToCollection } = useCollectionActions(
        mediaType,
        item,
        user,
    );
    const handleSave = (platformId: string) => {
        handleAddToCollection("watched", platformId);
        onClose();
    };
    return (
        <WatchedModal
            onClose={onClose}
            onConfirm={handleSave}
            movieTitle={"title" in item ? item.title : item.name}
        />
    );
}
