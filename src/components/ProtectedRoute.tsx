"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { APP_ROUTES } from "@/config/routes";
import { useEffect } from "react";
import Loader from "./Loader";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(APP_ROUTES.SIGNIN.path);
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <Loader size="large">Пожалуйста, подождите</Loader>;
    }
    if (user) {
        return <>{children}</>;
    }
    return null;
}