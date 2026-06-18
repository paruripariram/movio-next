"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ChildrenProps = { isActive: boolean };
type ChildrenFunction = (props: ChildrenProps) => ReactNode;

interface NavMenuLinkProps {
    href: string;
    children: ReactNode | ChildrenFunction;
}

export default function NavMenuLink({ href, children }: NavMenuLinkProps) {
    const pathname = usePathname();

    const isActive = href === pathname;
    return (
        <Link
            href={href}
            className={`p-3 w-full flex gap-2 rounded-2xl items-center transition-all duration-300 ease-in-out hover:bg-bgcolor ${isActive ? "text-primary bg-back-link-color" : "text-gray-500"} `}
        >
            {typeof children === "function"
                ? (children as ChildrenFunction)({ isActive })
                : children}
        </Link>
    );
}
