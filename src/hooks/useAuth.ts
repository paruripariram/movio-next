"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/services/auth/auth";
import type { authForm } from "../types";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/routes";
import { handleError } from "@/helpers/errorHandler";

export default function useAuth() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (formData: authForm) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            await registerUser(
                formData.email,
                formData.password,
                formData.username!,
            );
            router.push(APP_ROUTES.HOME.path);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                return false;
            } else {
                setError("Failed to register user");
                return false;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (formData: authForm) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            await loginUser(formData.email, formData.password);
            router.push(APP_ROUTES.HOME.path);
            return true;
        } catch (error) {
            handleError(error, "Failed to login user", setError);
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { handleRegister, handleLogin, loading, error };
}
