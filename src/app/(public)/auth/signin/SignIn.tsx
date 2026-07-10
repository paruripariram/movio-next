"use client";

import { AtSign, LockKeyhole } from "lucide-react";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import useForm from "@/hooks/useForm";
import type { authForm } from "@/types";
import Link from "next/link";
import { APP_ROUTES } from "@/config/routes";
import GoogleButton from "@/components/GoogleButton";
import { loginAction } from "@/actions/authActions";
import { useTransition } from "react";
import { handleError } from "@/helpers/errorHandler";

export default function SignIn() {
    const { formData, handleChange } = useForm<authForm>({
        email: "",
        password: "",
    });

    const [isPending, startTransition] = useTransition();

    const handleFormLogin = (formData: FormData) => {
        startTransition(async () => {
            const result = await loginAction(formData);
            if (result && !result.success) {
                handleError(
                    result.error,
                    "Ошибка при входе. Попробуйте еще раз.",
                );
            }
        });
    };

    return (
        <>
            <h1 className="text-white text-5xl font-bold mb-6">Login</h1>
            <div className="rounded-xl bg-form-color p-8 min-h-100 min-w-100">
                <form
                    action={handleFormLogin}
                    className="flex flex-col gap-15"
                    autoComplete="off"
                >
                    <div className="flex flex-col gap-5">
                        <AuthInput
                            inputName="email"
                            inputType="email"
                            label="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="johnwick@email.com"
                            icon={AtSign}
                            isLoading={isPending}
                        />

                        <AuthInput
                            inputName="password"
                            inputType="password"
                            label="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon={LockKeyhole}
                            isLoading={isPending}
                        />
                    </div>

                    <AuthButton isLoading={isPending}>Sign In</AuthButton>
                </form>
                <div className="flex flex-col text-center text-white/50 mb-8">
                    <p>Don&apos;t have an account?</p>{" "}
                    <Link
                        href={APP_ROUTES.SIGNUP.path}
                        className="text-primary"
                    >
                        Sign Up
                    </Link>
                </div>
                <GoogleButton isLoading={isPending} page="signin" />
            </div>
        </>
    );
}
