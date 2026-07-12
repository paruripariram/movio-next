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
        if( user && !isLoadingUser ) {
            router.push(APP_ROUTES.HOME.path);
        }
    }, [user, isLoadingUser, router]);
    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-center -ml-35 -mt-30">

                {children}
  
        </div>
    );
}
