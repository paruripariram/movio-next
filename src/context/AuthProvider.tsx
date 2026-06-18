'use client'

import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import type { firebaseUser } from "../types/firebaseUser";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [authState, setAuthState] = useState<AuthContextType>({ user: null, isLoading: true });
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) =>
            setAuthState({ user: user as firebaseUser, isLoading: false }),
        );

        return () => unsubscribe();
    },[]);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
}
