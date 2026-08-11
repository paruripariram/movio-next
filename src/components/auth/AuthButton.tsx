'use client'

interface AuthLayoutProps {
    children: React.ReactNode;
    isLoading: boolean;
}

export default function AuthButton({ children, isLoading }: AuthLayoutProps) {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white w-full h-12 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold transition-all duration-300"
        >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                children
            )}
        </button>
    );
}

