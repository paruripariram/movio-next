"use client";

import { AtSign, LockKeyhole, User } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import useForm from "@/hooks/useForm";
import type { authForm } from "@/types";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";
import { APP_ROUTES } from "@/config/routes";
import { handleError } from "@/helpers/errorHandler";
import { registerAction } from "@/actions/authActions";
import { useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SignUp() {
    const { formData, handleChange, errors, setErrors } = useForm<authForm>({
        username: "",
        email: "",
        password: "",
    });

    const [isPending, startTransition] = useTransition();

    const handleFormRegister = (formData: FormData) => {
        setErrors({});
        startTransition(async () => {
            const result = await registerAction(formData);
            if (result && !result.success) {
                if (result.fieldErrors) {
                    setErrors(result.fieldErrors);
                } else if (result.error) {
                    handleError(
                        result.error,
                        "Ошибка при регистрации. Попробуйте еще раз.",
                    );
                }
            }
        });
    };

    return (
        <>
            <h1 className="text-white text-5xl font-bold mb-6">Register</h1>
            <div className="rounded-xl bg-form-color p-8 min-h-100 min-w-100">
                <form
                    action={handleFormRegister}
                    className="flex flex-col gap-15 mb-1"
                    autoComplete="off"
                >
                    <div className="flex flex-col gap-5">
                        <AuthInput
                            inputName="username"
                            inputType="text"
                            label="username"
                            value={formData.username ?? ""}
                            onChange={handleChange}
                            placeholder="John Wick"
                            icon={User}
                            isLoading={isPending}
                        />
                        <div className="h-6">
                            <AnimatePresence>
                                {errors.username && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-sm"
                                    >
                                        {errors.username[0]}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

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
                        <div className="h-6">
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-sm"
                                    >
                                        {errors.email[0]}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

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
                        <div className="h-6">
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-sm"
                                    >
                                        {errors.password[0]}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <AuthButton isLoading={isPending}>Sign Up</AuthButton>
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
                <GoogleButton isLoading={isPending} page="signup" />
            </div>
        </>
    );
}
