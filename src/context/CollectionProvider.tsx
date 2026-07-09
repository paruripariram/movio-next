'use client'

import { useAuthContext } from "./AuthContext";
import useCollection from "../hooks/useCollection";
import { CollectionContext } from "./CollectionContext";

interface CollectionProviderProps {
    children: React.ReactNode;
}

export function CollectionProvider({ children }: CollectionProviderProps) {
    const { user } = useAuthContext();
    const { collectionArr, isLoadingCollection, criticalError } = useCollection(user?.id);

    return (
        <CollectionContext.Provider
            value={{
                collectionArr: collectionArr,
                isLoadingCollection: isLoadingCollection,
                criticalError,
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
}
