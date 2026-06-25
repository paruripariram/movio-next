'use client'


import { createContext, useContext } from 'react'
import type { collectionItem } from '../types';

export interface CollectionContextType {
    collectionArr: collectionItem[];
    isLoadingCollection: boolean;
    criticalError: unknown | null;
}

export const CollectionContext = createContext<CollectionContextType | undefined>(undefined)


export function useCollectionContext() {
    const context = useContext(CollectionContext)
    if (context === undefined) {
        throw new Error("useCollectionContext must be used within an CollectionProvider")
    }
    return context
}
    