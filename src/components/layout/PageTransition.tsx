"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { FrozenRoute } from "./FrozenRoute";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const SCROLL_KEY_PREFIX = "movio:scroll:";

function PageTransitionContent({
    children,
    className,
}: PageTransitionProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const routeKey = useMemo(() => {
        const qs = searchParams.toString();
        return qs ? pathname + "?" + qs : pathname;
    }, [pathname, searchParams]);

    const routeKeyRef = useRef(routeKey);
    const isPopNavigationRef = useRef(false);
    const restorePrevRef = useRef<History["scrollRestoration"]>("auto");
    const saveRafRef = useRef<number | null>(null);

    const pendingRestoreYRef = useRef(0);
    const hasPendingPopRestoreRef = useRef(false);

    useEffect(() => {
        routeKeyRef.current = routeKey;
    }, [routeKey]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const saveScroll = () => {
            sessionStorage.setItem(
                SCROLL_KEY_PREFIX + routeKeyRef.current,
                String(window.scrollY),
            );
        };

        const onScroll = () => {
            if (saveRafRef.current !== null) return;
            saveRafRef.current = window.requestAnimationFrame(() => {
                saveRafRef.current = null;
                saveScroll();
            });
        };

        const onPopState = () => {
            isPopNavigationRef.current = true;
        };

        const onPageHide = () => {
            saveScroll();
        };

        restorePrevRef.current = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";

        saveScroll();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("popstate", onPopState);
        window.addEventListener("pagehide", onPageHide);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener("pagehide", onPageHide);

            if (saveRafRef.current !== null) {
                window.cancelAnimationFrame(saveRafRef.current);
                saveRafRef.current = null;
            }

            window.history.scrollRestoration = restorePrevRef.current;
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!isPopNavigationRef.current) {
            hasPendingPopRestoreRef.current = false;
            return;
        }

        const raw = sessionStorage.getItem(SCROLL_KEY_PREFIX + routeKey);
        const saved = raw ? Number(raw) : 0;

        pendingRestoreYRef.current = Number.isFinite(saved) ? saved : 0;
        hasPendingPopRestoreRef.current = true;
        isPopNavigationRef.current = false;
    }, [routeKey]);

    return (
        <AnimatePresence
            mode="wait"
            onExitComplete={() => {
                if (!hasPendingPopRestoreRef.current) return;

                window.scrollTo({
                    top: pendingRestoreYRef.current,
                    behavior: "auto",
                });

                hasPendingPopRestoreRef.current = false;
            }}
        >
            <motion.div
                key={pathname}
                className={className}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <FrozenRoute>{children}</FrozenRoute>
            </motion.div>
        </AnimatePresence>
    );
}

export default function PageTransition(props: PageTransitionProps) {
    return (
        <Suspense fallback={null}>
            <PageTransitionContent {...props} />
        </Suspense>
    );
}