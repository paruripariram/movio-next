import { getCollection } from "@/services/db/collection.service";
import { collectionItem } from "@/types";
import { create } from "zustand";

interface CollectionState {
    collectionArr: collectionItem[];
    isLoadingCollection: boolean;
    criticalError: Error | null;
    subscribeToCollection: (userId: string) => Promise<void>;
    clearCollection: () => void;
    upsertLocalItem: (item: collectionItem) => void;
    removeLocalItem: (id: number, type: "movie" | "tv") => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
    collectionArr: [],
    isLoadingCollection: false,
    criticalError: null,

    subscribeToCollection: async (userId: string) => {
        set({ isLoadingCollection: true, criticalError: null });
        try {
            const items = await getCollection(userId);
            set({
                collectionArr: items,
                isLoadingCollection: false,
                criticalError: null,
            });
        } catch (error) {
            set({
                criticalError:
                    error instanceof Error ? error : new Error(String(error)),
                isLoadingCollection: false,
            });
        }
    },
    clearCollection: () => {
        set({
            collectionArr: [],
            isLoadingCollection: false,
            criticalError: null,
        });
    },
    upsertLocalItem: (newItem) =>
        set((state) => {
            const exists = state.collectionArr.some(
                (item) => item.id === newItem.id && item.type === newItem.type,
            );
            return {
                collectionArr: exists
                    ? state.collectionArr.map((item) =>
                          item.id === newItem.id && item.type === newItem.type
                              ? newItem
                              : item,
                      )
                    : [newItem, ...state.collectionArr],
            };
        }),

    removeLocalItem: (id, type) =>
        set((state) => ({
            collectionArr: state.collectionArr.filter(
                (item) => !(item.id === id && item.type === type),
            ),
        })),
}));
