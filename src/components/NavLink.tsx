"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ChildrenProps = { isActive: boolean };
type ChildrenFunction = (props: ChildrenProps) => ReactNode;

interface NavMenuLinkProps {
    href: string;
    children: ReactNode | ChildrenFunction;
    onClick?: () => void;
}

export default function NavMenuLink({ href, children, onClick }: NavMenuLinkProps) {
    const pathname = usePathname();

    const decodedPathname = decodeURIComponent(pathname);

    const isActive = href === decodedPathname;
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`p-3 w-full flex gap-3 rounded-2xl items-center transition-all duration-300 ease-in-out hover:bg-bgcolor ${
                isActive ? "text-primary bg-back-link-color font-semibold" : "text-gray-500"
            }`}
        >
            {typeof children === "function"
                ? (children as ChildrenFunction)({ isActive })
                : children}
        </Link>
    );
}