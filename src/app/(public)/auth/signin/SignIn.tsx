'use client'

import { AtSign, LockKeyhole } from "lucide-react";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import useForm from "@/hooks/useForm";
import type { authForm } from "@/types";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { APP_ROUTES } from "@/config/routes";

export default function SignIn() {
    const { formData, handleChange, resetForm } = useForm<authForm>({
        email: "",
        password: "",
    });

    const { handleLogin, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await handleLogin(formData);
        if (success) resetForm()
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-15 mb-10"
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
                {error && (
                    <p className="text-red-500 text-base mt-2 text-center">
                        {error}
                    </p>
                )}
            </form>
            <div className="text-center text-white/50">
                <p>Don&apos;t have an account?</p> <Link href={APP_ROUTES.SIGNUP.path} className="text-primary">Sign Up</Link>
            </div>
        </>
    );
}
