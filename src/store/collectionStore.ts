import { getCollection } from "@/services/database/firebase/collectionService";
import { collectionItem } from "@/types";
import { create } from "zustand";

interface CollectionState {
    collectionArr: collectionItem[];
    isLoadingCollection: boolean;
    criticalError: Error | null;
    subscribeToCollection: (userId: string) => void;
    unsubscribe: (() => void) | null;
    clearCollection: () => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
    collectionArr: [],
    isLoadingCollection: false,
    criticalError: null,
    unsubscribe: null,
    subscribeToCollection: (userId: string) => {
        get().clearCollection();
        set({ isLoadingCollection: true });
        const unsubscribe = getCollection(
            userId,
            (items) =>
                set({
                    collectionArr: items,
                    isLoadingCollection: false,
                    criticalError: null,
                }),
            (error) =>
                set({ criticalError: error, isLoadingCollection: false }),
        );
        set({unsubscribe: unsubscribe})
    },
    clearCollection: () => {
        const {unsubscribe} = get();
        if (unsubscribe) {
            unsubscribe();
        }
        set({ collectionArr: [], isLoadingCollection: false, criticalError: null, unsubscribe: null });
    }
}));
