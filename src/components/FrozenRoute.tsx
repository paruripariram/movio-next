"use client";

import { useContext, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function FrozenRoute({ children }: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);
    const [frozenContext] = useState(context);

    return (
        <LayoutRouterContext.Provider value={frozenContext}>
            {children}
        </LayoutRouterContext.Provider>
    );
}