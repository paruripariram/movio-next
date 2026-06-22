'use client'

import { AtSign, LockKeyhole, User } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import useForm from "@/hooks/useForm";
import type { authForm } from "@/types";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function SignUp() {
    const { formData, handleChange, resetForm } =
        useForm<authForm>({
            username: "",
            email: "",
            password: "",
        });

    const { handleRegister, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await handleRegister(formData);
        if (success) resetForm();
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
                {error && (
                    <p className="text-red-500 text-base mt-2 text-center">
                        {error}
                    </p>
                )}
            </form>
            <div className="text-center text-white/50">
                Already have an account? <Link href="/login" className="text-primary">Sign In</Link>
            </div>
        </>
    );
}

