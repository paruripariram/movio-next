"use client"

import { APP_ROUTES } from "@/config/routes";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {

        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push(APP_ROUTES.HOME.path);
        }
    };
    return (
        <button
            onClick={handleBack}
            className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
        >
            <ArrowBigLeft />
        </button>
    );
}
