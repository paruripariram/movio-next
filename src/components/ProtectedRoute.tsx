"use client";

import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/routes";
import { useEffect } from "react";
import Loader from "./Loader";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoadingUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoadingUser && !user) {
            router.push(APP_ROUTES.SIGNIN.path);
        }
    }, [user, isLoadingUser, router]);

    if (isLoadingUser) {
        return <Loader size="large">Пожалуйста, подождите</Loader>;
    }
    if (user) {
        return <>{children}</>;
    }
    return null;
}