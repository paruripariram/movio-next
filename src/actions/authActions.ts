"use server";

import { signIn } from "@/auth";
import { userService } from "@/services/database/firebase/userService";
import { AuthError } from "next-auth";
import { signInSchema, signUpSchema } from "@/helpers/schemas/authSchema";

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
        const rawData = Object.fromEntries(formData);
        const result = signUpSchema.safeParse(rawData);
        if (!result.success) {
            return {
                success: false,
                fieldErrors: result.error.flatten().fieldErrors,
            };
        }
        const { username, email, password } = result.data;

        await userService.registerCredentialsUser(email, password, username);

        await signIn("credentials", {
            email,
            password,
            redirect: false,
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
    const rawData = Object.fromEntries(formData);
    const result = signInSchema.safeParse(rawData);
    if (!result.success) {
        return {
            success: false,
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }
    const { email, password } = result.data;
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
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
