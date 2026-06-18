'use client'

import { createContext, useContext } from 'react'
import type { firebaseUser } from '@/types/firebaseUser'

export interface AuthContextType {
    user: firebaseUser;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider")
    }
    return context
}
    