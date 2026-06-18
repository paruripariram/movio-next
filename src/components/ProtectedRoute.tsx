"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { APP_ROUTES } from "@/config/routes";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(APP_ROUTES.SIGNIN.path);
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
                <p className="text-sm text-gray-500 mt-2">Please, wait...</p>
            </div>
        );
    }
    if (user) {
        return <>{children}</>;
    }
    return null;
}

export default ProtectedRoute;
