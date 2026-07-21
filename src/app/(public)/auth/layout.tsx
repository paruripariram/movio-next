"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/routes";
import { useAuthStore } from "@/store/authStore";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const router = useRouter();
    const { user, isLoadingUser } = useAuthStore();

    useEffect(() => {
        if (user && !isLoadingUser) {
            router.push(APP_ROUTES.HOME.path);
        }
    }, [user, isLoadingUser, router]);

    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-start pt-10 sm:pt-16 lg:justify-center lg:pt-0 lg:-ml-35 lg:-mt-30 p-4">
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                {children}
            </div>
        </div>
    );
}