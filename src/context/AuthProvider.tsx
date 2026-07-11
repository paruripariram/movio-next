"use client";

import React from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import { SessionProvider, useSession } from "next-auth/react";

interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthStateBridge({ children }: AuthProviderProps) {
    const { data: session, status } = useSession();

    const authState: AuthContextType = {
        user: session?.user?.id
            ? {
                  id: session.user.id,
                  name: session.user.name ?? null,
                  email: session.user.email ?? null,
                  image: session.user.image ?? null,
              }
            : null,
        isLoading: status === "loading",
    };
    const userId = session?.user?.id ?? "guest";

    return (
        <AuthContext.Provider value={authState}>
            <React.Fragment key={userId}>{children}</React.Fragment>
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider>
            <AuthStateBridge>{children}</AuthStateBridge>
        </SessionProvider>
    );
}
