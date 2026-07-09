"use client";

import { useState } from "react";
import type { authForm } from "../types";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/routes";
import { handleError } from "@/helpers/errorHandler";
import { userService } from "@/services/database/firebase/userService";
import { signIn } from "next-auth/react";

export default function useAuth() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleRegister = async (formData: authForm) => {
        if (loading) return false;
        setLoading(true);
        try {
            await userService.registerCredentialsUser(
                formData.email,
                formData.password,
                formData.username!,
            );

            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })
            if(result?.error){
                handleError(result.error, "Аккаунт создан, но не удалось войти автоматически. Попробуйте войти вручную.");
                return false
            }

            router.push(APP_ROUTES.HOME.path);
            router.refresh();
            return true;
        } catch (error) {
            handleError(error, "Ошибка при регистрации")
            return false;

        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (formData: authForm) => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if(result?.error){
                handleError(result.error, "Ошибка при входе. Проверьте свои учетные данные и попробуйте снова.");
                return false;
            }
            router.push(APP_ROUTES.HOME.path);
            router.refresh();
            return true;
        } catch (error) {
            handleError(error, "Ошибка при входе");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return { handleRegister, handleLogin, loading };
}
