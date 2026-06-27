import { APP_ROUTES } from "@/config/routes";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="text-white w-full max-w-150 min-h-[75vh] flex flex-col items-center justify-center gap-6 text-center mx-auto px-4">
            <h1 className="text-4xl font-bold">Ой, такой страницы нет</h1>
            <p className="text-xl font-medium">
                Возможно, вы ввели неверный адрес или страница была удалена.
                Проверьте правильность написания URL или перейдите на главную
                страницу.
            </p>
            <Link
                href={APP_ROUTES.HOME.path}
                className="bg-primary text-white w-full max-w-xs h-12 p-4 rounded-xl flex items-center justify-center relative disabled:opacity-70 cursor-pointer shadow-glow hover:shadow-glow-bold"
            >
                Вернуться на главную
            </Link>
        </div>
    );
}
