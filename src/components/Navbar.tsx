"use client";

import NavMenuLink from "./NavLink";
import {
    CircleUser,
    Clapperboard,
    House,
    LoaderCircle,
    Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_ROUTES } from "@/config/routes";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";

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

    return (
        <nav className="flex flex-col items-center p-5 w-70 bg-form-color shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)] rounded-br-4xl fixed">
            <Image
                src="/logoMovio.png"
                alt="logo"
                width={100}
                height={100}
                priority
            />
            <h1 className="text-primary text-6xl font-extrabold text-center mb-20">
                Movio
            </h1>
            <ul className="flex flex-col gap-6 w-full">
                {navItems.map(({ href, title, icon: Icon }) => (
                    <li className="nav-li" key={href}>
                        <NavMenuLink href={href}>
                            <Icon />
                            {title}
                        </NavMenuLink>
                    </li>
                ))}
                {isLoadingUser && (
                    <li className="nav-li">
                        <div className="p-3 w-full flex gap-2 rounded-2xl text-gray-500">
                            <LoaderCircle className="animate-spin" />
                            Loading...
                        </div>
                    </li>
                )}
                {!isLoadingUser && !user && (
                    <li className="nav-li">
                        <NavMenuLink href={APP_ROUTES.SIGNIN.path}>
                            <CircleUser />
                            Sign In
                        </NavMenuLink>
                    </li>
                )}
                {!isLoadingUser && user && (
                    <li className="nav-li">
                        <NavMenuLink
                            href={APP_ROUTES.PROFILE.path(
                                user.name || "profile",
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl ${
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
                                                className="rounded-full"
                                            />
                                        ) : (
                                            (user.name
                                                ? user.name.charAt(0)
                                                : user.email?.charAt(0) || "?"
                                            ).toUpperCase()
                                        )}
                                    </div>
                                    <span className="truncate">
                                        {user.name || user.email}
                                    </span>
                                </>
                            )}
                        </NavMenuLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}
