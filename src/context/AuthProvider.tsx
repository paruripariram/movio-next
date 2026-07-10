"use client";

import { usePathname } from "next/navigation";
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
    <div key={userId} className="absolute inset-0 -z-50 pointer-events-none">
        {children}
    </div>;

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();
    return (
        <SessionProvider key={pathname}>
            <AuthStateBridge>{children}</AuthStateBridge>
        </SessionProvider>
    );
}
