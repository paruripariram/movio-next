"use client";

interface ErrorProps {
    reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
    return (
        <div className="text-white w-full max-w-150 min-h-[75vh] flex flex-col items-center justify-center gap-6 text-center mx-auto px-4">
            <h1 className="text-4xl font-bold">Упс! Что-то пошло не так</h1>
            <p className="text-xl font-medium">
                Произошла ошибка при загрузке данных. Возможно, проблемы с сетью
                или сервером.
            </p>
            <button
                className="bg-primary text-white w-full max-w-xs h-12 p-4 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold"
                onClick={()=>reset()}
            >
                Попробовать снова
            </button>
        </div>
    );
}
