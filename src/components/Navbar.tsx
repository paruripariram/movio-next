"use client";

import { useState } from "react";
import NavMenuLink from "./NavLink";
import {
    CircleUser,
    Clapperboard,
    House,
    LoaderCircle,
    Menu,
    Search,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_ROUTES } from "@/config/routes";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

type NavItem = {
    href: string;
    icon: LucideIcon;
    title: string;
};

const navItems: NavItem[] = [
    { href: APP_ROUTES.HOME.path, icon: House, title: APP_ROUTES.HOME.title },
    {
        href: APP_ROUTES.COLLECTION.path,
        icon: Clapperboard,
        title: APP_ROUTES.COLLECTION.title,
    },
    {
        href: APP_ROUTES.SEARCH.path,
        icon: Search,
        title: APP_ROUTES.SEARCH.title,
    },
];

export default function Navbar() {
    const { user, isLoadingUser } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Мобильная верхняя плашка */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-form-color px-4 flex items-center justify-between z-50 border-b border-zinc-800/50 shadow-md">
                <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                    <Image
                        src="/logoMovio.webp"
                        alt="logo"
                        width={36}
                        height={36}
                        priority
                    />
                    <span className="text-primary text-2xl font-extrabold">
                        Movio
                    </span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-white hover:bg-bgcolor rounded-xl transition-colors cursor-pointer"
                    aria-label="Переключить меню"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                    onClick={closeMenu}
                />
            )}

            <nav
                className={`
                    fixed top-0 left-0 z-40 bg-form-color shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)]
                    flex flex-col items-center p-5 transition-transform duration-300 ease-in-out
                    w-64 md:w-60 2xl:w-70
                    h-screen md:h-auto
                    pt-20 md:pt-5
                    rounded-r-3xl md:rounded-r-none md:rounded-br-4xl
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="hidden md:flex flex-col items-center">
                    <Image
                        src="/logoMovio.webp"
                        alt="logo"
                        width={100}
                        height={100}
                        priority
                    />
                    <h1 className="text-primary text-4xl 2xl:text-6xl font-extrabold text-center mb-10 2xl:mb-20">
                        Movio
                    </h1>
                </div>

                <ul className="flex flex-col gap-4 2xl:gap-6 w-full">
                    {navItems.map(({ href, title, icon: Icon }) => (
                        <li className="nav-li" key={href}>
                            <NavMenuLink href={href} onClick={closeMenu}>
                                <Icon className="w-5 h-5" />
                                {title}
                            </NavMenuLink>
                        </li>
                    ))}
                    {isLoadingUser && (
                        <li className="nav-li">
                            <div className="p-3 w-full flex gap-2 rounded-2xl text-gray-500 items-center">
                                <LoaderCircle className="animate-spin w-5 h-5" />
                                Загрузка...
                            </div>
                        </li>
                    )}
                    {!isLoadingUser && !user && (
                        <li className="nav-li">
                            <NavMenuLink href={APP_ROUTES.SIGNIN.path} onClick={closeMenu}>
                                <CircleUser className="w-5 h-5" />
                                Войти
                            </NavMenuLink>
                        </li>
                    )}
                    {!isLoadingUser && user && (
                        <li className="nav-li">
                            <NavMenuLink
                                href={APP_ROUTES.PROFILE.path(
                                    user.name || "profile",
                                )}
                                onClick={closeMenu}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div
                                            className={`w-9 h-9 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center text-lg 2xl:text-3xl shrink-0 ${
                                                isActive
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-500 text-form-color"
                                            }`}
                                        >
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt="Profile"
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full w-full h-full object-cover"
                                                />
                                            ) : (
                                                (user.name
                                                    ? user.name.charAt(0)
                                                    : user.email?.charAt(0) || "?"
                                                ).toUpperCase()
                                            )}
                                        </div>
                                        <span className="truncate text-sm 2xl:text-base">
                                            {user.name || user.email}
                                        </span>
                                    </>
                                )}
                            </NavMenuLink>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
}