import { collectionItem } from "@/types";
import { MovieDetails, PersonCreditItem, SearchResult, TVDetails } from "@/types/tmdb";
import { create } from "zustand";

interface ModalState {
    item: collectionItem | MovieDetails | TVDetails | SearchResult | PersonCreditItem | null;
    isOpen: boolean;
    mediaType: "movie" | "tv" | null;
    closeModal: () => void;
    openModal: (
        item: collectionItem | MovieDetails | TVDetails | SearchResult | PersonCreditItem,
        mediaType: "movie" | "tv",
    ) => void;
}

export const useWatchedModalStore = create<ModalState>((set) => ({
    item: null,
    isOpen: false,
    mediaType: null,
    openModal: (item, mediaType) => set({ isOpen: true, item, mediaType }),
    closeModal: () => set({ isOpen: false, item: null, mediaType: null }),
}));
