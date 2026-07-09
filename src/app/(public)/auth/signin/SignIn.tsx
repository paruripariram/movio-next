"use client";

import { AtSign, LockKeyhole } from "lucide-react";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import useForm from "@/hooks/useForm";
import type { authForm } from "@/types";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { APP_ROUTES } from "@/config/routes";
import GoogleButton from "@/components/GoogleButton";

export default function SignIn() {
    const { formData, handleChange, resetForm } = useForm<authForm>({
        email: "",
        password: "",
    });

    const { handleLogin, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await handleLogin(formData);
        if (success) resetForm();
    };

    return (
        <>
            <h1 className="text-white text-5xl font-bold mb-6">Login</h1>
            <div className="rounded-xl bg-form-color p-8 min-h-100 min-w-100">
                <form
                    onSubmit={handleSubmit}
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
                        />

                        <AuthInput
                            inputName="password"
                            inputType="password"
                            label="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon={LockKeyhole}
                        />
                    </div>

                    <AuthButton isLoading={loading}>Sign In</AuthButton>
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
                <GoogleButton isLoading={loading} page="signin" />
            </div>
        </>
    );
}
