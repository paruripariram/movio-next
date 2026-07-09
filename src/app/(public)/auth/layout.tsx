"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/routes";
import { useAuthContext } from "@/context/AuthContext";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const router = useRouter();
    const { user, isLoading } = useAuthContext();

    useEffect(() => {
        if( user && !isLoading ) {
            router.push(APP_ROUTES.HOME.path);
        }
    }, [user, isLoading, router]);
    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-center -ml-35 -mt-30">

                {children}
  
        </div>
    );
}
