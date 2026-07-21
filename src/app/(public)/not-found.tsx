import { APP_ROUTES } from "@/config/routes";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="text-white w-full max-w-md sm:max-w-xl 2xl:max-w-150 min-h-[60vh] sm:min-h-[75vh] flex flex-col items-center justify-center gap-4 sm:gap-6 text-center mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Ой, такой страницы нет</h1>
            <p className="text-sm sm:text-base lg:text-xl font-medium text-zinc-300">
                Возможно, вы ввели неверный адрес или страница была удалена.
                Проверьте правильность написания URL или перейдите на главную
                страницу.
            </p>
            <Link
                href={APP_ROUTES.HOME.path}
                className="bg-primary text-white w-full max-w-xs h-11 sm:h-12 p-4 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold text-sm sm:text-base transition-all"
            >
                Вернуться на главную
            </Link>
        </div>
    );
}