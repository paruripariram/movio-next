"use server";

import { signIn } from "@/auth";
import { APP_ROUTES } from "@/config/routes";
import { userService } from "@/services/database/firebase/userService";
import { AuthError } from "next-auth";

interface NextRedirectError {
    digest: string;
    message?: string;
}

function isNextRedirect(error: unknown): error is NextRedirectError {
    return (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as Record<string, unknown>).digest === "string"
    );
}

export async function registerAction(formData: FormData) {
    try {
        if (!formData.get("username")) {
            return { success: false, error: "Имя пользователя обязательно" };
        }

        await userService.registerCredentialsUser(
            formData.get("email") as string,
            formData.get("password") as string,
            formData.get("username") as string,
        );

        await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirectTo: APP_ROUTES.HOME.path,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                success: false,
                error: "Аккаунт создан, но автоматический вход не удался.",
            };
        }

        if (error instanceof Error) {
            if (error.message.includes("NEXT_REDIRECT")) {
                throw error;
            }
            return { success: false, error: error.message };
        }

        return { success: false, error: "Ошибка при регистрации" };
    }
}

export async function loginAction(formData: FormData) {
    try {
        await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirectTo: APP_ROUTES.HOME.path,
        });

        return { success: true };
    } catch (error) {
        if (isNextRedirect(error)) {
            throw error;
        }
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        success: false,
                        error: "Неверный email или пароль.",
                    };
                default:
                    return {
                        success: false,
                        error: "Ошибка авторизации. Проверьте данные.",
                    };
            }
        }

        if (error instanceof Error) {
            if (error.message.includes("NEXT_REDIRECT")) {
                throw error;
            }
            return { success: false, error: error.message };
        }

        return { success: false, error: "Ошибка при входе" };
    }
}
