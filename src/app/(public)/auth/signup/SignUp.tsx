"use client";

import { AtSign, LockKeyhole, User } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import useForm from "@/hooks/useForm";
import type { authForm } from "@/types";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";
import { APP_ROUTES } from "@/config/routes";

export default function SignUp() {
    const { formData, handleChange, resetForm } = useForm<authForm>({
        username: "",
        email: "",
        password: "",
    });

    const { handleRegister, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await handleRegister(formData);
        if (success) resetForm();
    };

    return (
        <>
            <h1 className="text-white text-5xl font-bold mb-6">Register</h1>
            <div className="rounded-xl bg-form-color p-8 min-h-100 min-w-100">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-15 mb-1"
                    autoComplete="off"
                >
                    <div className="flex flex-col gap-5">
                        <AuthInput
                            inputName="username"
                            inputType="text"
                            label="username"
                            value={formData.username!}
                            onChange={handleChange}
                            placeholder="John Wick"
                            icon={User}
                        />

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

                    <AuthButton isLoading={loading}>Sign Up</AuthButton>
                </form>
                <div className="flex flex-col text-center text-white/50 mb-8">
                    Already have an account?{" "}
                    <Link
                        href={APP_ROUTES.SIGNIN.path}
                        className="text-primary"
                    >
                        Sign In
                    </Link>
                </div>
                <GoogleButton isLoading={loading} page="signup" />
            </div>
        </>
    );
}
