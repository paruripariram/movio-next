import { APP_ROUTES } from "@/config/routes";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface GoogleButtonProps {
    isLoading: boolean;
    page: 'signin' | 'signup';
}

export default function GoogleButton({ isLoading, page }: GoogleButtonProps) {
    return (
        <button
            onClick={() =>
                signIn("google", { callbackUrl: APP_ROUTES.HOME.path })
            }
            className="bg-primary text-white w-full h-14 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold transition-all duration-300"
        >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <div className="w-full flex gap-5 justify-center items-center">
                    <Image
                        src="/google.svg"
                        alt="Google Icon"
                        width={36}
                        height={36}
                    />
                    <p>{page === 'signin' ? 'Войти' : 'Зарегистрироваться'} через Google</p>
                </div>
            )}
        </button>
    );
}
