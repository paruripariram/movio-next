'use client'

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { APP_ROUTES } from "@/config/routes";

interface AuthLayoutProps {
    children: ReactNode;
    title: "Registration" | "Login";
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.push(APP_ROUTES.HOME.path);
            }
        });
        return () => unsubscribe();
    }, [router]);
    return (
            <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-white text-5xl font-bold mb-6">{title}</h1>
                <div className="rounded-xl bg-form-color p-8 min-h-100 min-w-100">
                    {children}
                </div>
            </div>
    );
}
